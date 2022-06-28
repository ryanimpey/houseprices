import type { districts } from "@prisma/client"

import { prisma } from "~/db.server";

export async function getDistricts() {
    const districts = await prisma.districts.findMany({
        select: {
            'OBJECTID': true,
            'LAD21NM': true
        }
    });

   return districts.map(({OBJECTID, LAD21NM}) => ({value: String(OBJECTID), label: LAD21NM}));
}