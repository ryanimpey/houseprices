import { prisma } from "~/db.server";

export function getGeojsonById(id: String) {
    return prisma.geojson.findFirst({
        where: { id: Number(id) },
        select: { geometry: true },
        take: 1
    })
}