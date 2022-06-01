import type { places } from "@prisma/client";

import { prisma } from "~/db.server";

export function getPlaceRegions() {
  return prisma.places.findMany({
    select: {
      region: true,
    },
  });
}

export function getPlaceGeo(region: string) {
  return prisma.places.findFirst({
    where: { region }, select: { geometry: true }
} );
}
