"use server";

import { requireAuth } from "@/lib/auth";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/db";
import { z } from "zod";

// Schema for URL validation
const urlSchema = z
  .string()
  .url()
  .regex(
    /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/,
    "Invalid YouTube URL"
  );

// Save livestream URL for a Mass (Admin only)
export async function saveLiveStreamUrl(massId: string, liveStreamUrl: string) {
  const user = await requireAuth();
  if (!user || (user.role !== Role.ADMIN && user.role !== Role.SUPERADMIN)) {
    throw new Error("Unauthorized: Only admins can update livestream URLs");
  }

  const validatedUrl = urlSchema.parse(liveStreamUrl);

  try {
    const updatedMass = await prisma.mass.update({
      where: { id: massId },
      data: { liveStreamUrl: validatedUrl },
    });
    return { success: true, mass: updatedMass };
  } catch (error) {
    throw new Error("Failed to save livestream URL");
  }
}

// Fetch Masses with livestream URLs
export async function getMassesWithLiveStream() {
  try {
    const masses = await prisma.mass.findMany({
      where: {
        date: {
          gte: new Date(new Date().setDate(new Date().getDate() - 30)), // Include past 30 days
        },
      },
      orderBy: { date: "desc" },
      select: {
        id: true,
        title: true,
        date: true,
        location: true,
        liveStreamUrl: true,
        status: true,
      },
    });
    return masses;
  } catch (error) {
    throw new Error("Failed to fetch masses");
  }
}
