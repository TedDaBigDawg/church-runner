"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addGuestbookEntry(formData: FormData) {
  const name = formData.get("name") as string;
  const message = formData.get("message") as string;

  if (!name || !message) {
    return { error: "Name and message are required." };
  }

  await prisma.guestbookEntry.create({
    data: {
      name,
      message,
    },
  });

  revalidatePath("/guestbook");
  return { success: true };
}

export async function getGuestbookEntries(
  cursor: string | undefined,
  take: number
) {
  const entries = await prisma.guestbookEntry.findMany({
    take: take + 1,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: {
      createdAt: "desc",
    },
  });

  let nextCursor: string | undefined = undefined;
  if (entries.length > take) {
    const nextItem = entries.pop();
    nextCursor = nextItem!.id;
  }

  return {
    entries,
    nextCursor,
  };
}
