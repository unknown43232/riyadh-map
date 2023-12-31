import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type LocationData = {
  placeId: string;
  name: string;
  lat: number;
  lng: number;
};

const API_KEY = process.env.GOOGLE_API_KEY;
const BASE_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
const RADIUS = 2500; // 2.5km, adjust as needed

const divideIntoGrids = (southWest: any, northEast: any, gridSize: number) => {
  const grids = [];
  for (let lat = southWest.lat; lat < northEast.lat; lat += gridSize) {
    for (let lng = southWest.lng; lng < northEast.lng; lng += gridSize) {
      grids.push({ lat: lat + gridSize / 2, lng: lng + gridSize / 2 }); // center of the grid
    }
  }
  return grids;
};

const fetchPharmaciesForLocation = async (lat: number, lng: number) => {
  let pageToken;
  let pharmacies: LocationData[] = [];

  do {
    const response: Response = await fetch(
      `${BASE_URL}?location=${lat},${lng}&radius=${RADIUS}&type=pharmacy&key=${API_KEY}${
        pageToken ? `&pagetoken=${pageToken}` : ""
      }`
    );
    const data = await response.json();

    const transformedData: LocationData[] = data.results.map((place: any) => ({
      placeId: place.place_id,
      name: place.name,
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
    }));

    pharmacies = [...pharmacies, ...transformedData];
    pageToken = data.next_page_token;

    if (pageToken) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  } while (pageToken);

  return pharmacies;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const southWest = { lat: 24.5, lng: 46.5 }; // Adjust based on Riyadh's boundaries
  const northEast = { lat: 24.9, lng: 47.0 }; // Adjust based on Riyadh's boundaries
  const gridSize = 0.05; // 5km, adjust as needed

  const gridCenters = divideIntoGrids(southWest, northEast, gridSize);
  let allPharmacies: LocationData[] = [];

  for (const center of gridCenters) {
    const pharmacies = await fetchPharmaciesForLocation(center.lat, center.lng);
    allPharmacies = [...allPharmacies, ...pharmacies];
  }

  // Remove duplicates based on placeId
  const uniquePharmacies = Array.from(
    new Set(allPharmacies.map((p) => p.placeId))
  ).map((placeId) => allPharmacies.find((p) => p.placeId === placeId));

  // Use Prisma to update the database
  // Remove all existing data
  await prisma.pharmacies.deleteMany();

  // Insert new data
  for (let pharmacy of uniquePharmacies) {
    if (pharmacy) {
      await prisma.pharmacies.create({
        data: {
          placeId: pharmacy.placeId,
          name: pharmacy.name,
          lat: pharmacy.lat,
          lng: pharmacy.lng,
        },
      });
    }
  }

  res.status(200).json({ message: "PharmacyDB updated successfully" });
}
