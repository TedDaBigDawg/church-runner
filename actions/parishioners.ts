"use server";
import { prisma } from "@/lib/db";

export const getAllParishioners = async (page?: number, limit?: number) => {
  const allParishioners = await prisma?.user.findMany({
    where: {
      role: "PARISHIONER",
    },
    select: {
      id: true,
      role: true,
      isBlocked: true,
      name: true,
      phone: true,
      email: true,
      createdAt: true,
    },
    skip: ((page ?? 1) - 1) * (limit ?? 10),
    take: limit,
    orderBy: {
      createdAt: "asc",
    },
  });
  const totalCount = await prisma?.user.count({
    where: {
      role: "PARISHIONER",
    },
  });
  return {
    allParishioners,
    totalCount,
  };
};

export const blockParishionerByID = async (id: string) => {
  const singleParishioner = await prisma?.user.update({
    where: {
      id: id,
    },
    data: {
      isBlocked: true,
    },
  });
  return {
    singleParishioner,
  };
};

export const unblockParishionerByID = async (id: string) => {
  const singleParishioner = await prisma?.user.update({
    where: {
      id: id,
    },
    data: {
      isBlocked: false,
    },
  });
  return {
    singleParishioner,
  };
};
