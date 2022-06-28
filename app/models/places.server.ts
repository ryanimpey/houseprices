import { prisma } from "~/db.server";

export function getPlaceRegions() {
  return prisma.places.findMany({
    select: {
      region: true,
    },
  });
}