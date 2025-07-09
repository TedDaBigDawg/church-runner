"use server";

import { pusherServer } from "@/lib/pusher";
import { revalidatePath } from "next/cache";

export async function addWish(formData: FormData) {
  const userId = formData.get("userId") as string;
  const name = formData.get("name") as string;
  const image = formData.get("image") as string;
  const message = formData.get("message") as string;

  try {
    const wish = await prisma.wish.create({
      data: { userId, name, image, message },
    });

    const wishWithTimestamp = {
      ...wish,
      createdAt: wish.createdAt.toISOString(),
    };

    await pusherServer.trigger("wishes", "new-wish", wishWithTimestamp);

    revalidatePath("/");
    return { success: true, wish: wishWithTimestamp };
  } catch (error) {
    console.error("Error creating wish:", error);
    return { success: false, error: "Failed to submit wish" };
  }
}

export async function getWishes() {
  try {
    const wishes = await prisma.wish.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return wishes.map((wish) => ({
      ...wish,
      createdAt: wish.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching wishes:", error);
    return [];
  }
}
