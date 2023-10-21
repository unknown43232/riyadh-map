import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const pharmacies = await prisma.pharmacies.findMany();
    res.status(200).json(pharmacies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch pharmacies from MongoDB" });
  }
}
