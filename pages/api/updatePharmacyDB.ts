import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Pharmacies } from "@prisma/client";

const prisma = new PrismaClient();

type LocationData = {
  id: number;
  name: string;
  lat: number;
  lng: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const API_KEY = process.env.GOOGLE_API_KEY;
  const BASE_URL =
    "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
  const LOCATION = "24.7136,46.6753"; // Riyadh coordinates
  const RADIUS = "50000"; // 50km around Riyadh

  let pageToken;
  let allPharmacies: LocationData[] = [];

  do {
    const response: Response = await fetch(
      `${BASE_URL}?location=${LOCATION}&radius=${RADIUS}&type=pharmacy&key=${API_KEY}${
        pageToken ? `&pagetoken=${pageToken}` : ""
      }`
    );
    const data = await response.json();

    const transformedData: LocationData[] = data.results.map((place: any) => ({
      id: place.place_id,
      name: place.name,
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
    }));

    allPharmacies = [...allPharmacies, ...transformedData];
    pageToken = data.next_page_token;

    if (pageToken) {
      // Google Places API requires a delay between requests when pagetoken is involved
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  } while (pageToken);

  // Use Prisma to update the database
  // Remove all existing data
  await prisma.pharmacies.deleteMany();

  // Insert new data
  for (let pharmacy of allPharmacies) {
    await prisma.pharmacies.create({
      data: {
        // id: pharmacy.id,
        placeId: pharmacy.id,
        name: pharmacy.name,
        lat: pharmacy.lat,
        lng: pharmacy.lng,
      },
    } as Pharmacies);
  }

  res.status(200).json({ message: "PharmacyDB updated successfully" });
}
