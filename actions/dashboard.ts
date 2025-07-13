"use server";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { getUserActivities } from "@/actions/activity-actions";

export async function getDashboardData() {
  const user = await requireAuth();

  const massIntentions = await prisma.massIntention.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 3,
    include: { mass: true },
  });

  const thanksgivings = await prisma.thanksgiving.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 3,
    include: { mass: true },
  });

  const payments = await prisma.payment.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 3,
    include: { goal: true },
  });

  const events = await prisma.event.findMany({
    where: { date: { gte: new Date() } },
    orderBy: { date: "asc" },
    take: 3,
  });

  const activities = await getUserActivities(5);

  return {
    user,
    massIntentions,
    thanksgivings,
    payments,
    events,
    activities,
  };
}
