import type { places } from "@prisma/client";

import { prisma } from "~/db.server";

export function getPlaceRegions() {
  return prisma.places.findMany({
    select: {
      region: true,
    },
  });
}