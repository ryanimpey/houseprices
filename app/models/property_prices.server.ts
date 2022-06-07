import type { prices } from "@prisma/client";
import { Result } from "postcss";

import { prisma } from "~/db.server";
import { PropertyType, PropertyTypeResult } from "~/utils";

function typeToTypeFields(type: PropertyType | null): Result<prices, boolean> {
  switch (type) {
    case "detached":
      return {
        Detached_Average_Price: true,
        Detached_Monthly_Change: true,
      };
    case "semi-detached":
      return {
        Semi_Detached_Average_Price: true,
        Semi_Detached_Monthly_Change: true,
      };
    case "terraced":
      return { Terraced_Average_Price: true, Terraced_Monthly_Change: true };
    case "flat":
      return { Flat_Average_Price: true, Flat_Monthly_Change: true };
    default:
      return { Flat_Average_Price: true, Flat_Monthly_Change: true };
  }
}

function calculateChangeVal(price: number, percentage: number): number {
  let totalPercentage = Number(percentage.toPrecision(2)) + 100;
  let prevPrice = (price/totalPercentage) * 100;
  return price - prevPrice;
}

export function getPresentableTypeString(type: PropertyType | null): string {
  switch (type) {
    case "detached":
      return "Detached Houses";
    case "semi-detached":
      return "Semi-Detached Houses";
    case "terraced":
      return "Terraced Houses";
    case "flat":
      return "Flats or Apartments";
    default:
      return "An Unknown Property Type";
  }
}

export async function getRecentPropertyPriceByArea(
  where: string | null,
  type: PropertyType | null
): Promise<PropertyTypeResult|null> {
  const resObj: PropertyTypeResult = {};
  const fields = typeToTypeFields(type);

  if (typeof where !== "string" || where == null) {
    return null;
  }

  const result = await prisma.prices.findFirst({
    where: {
      Region_Name: {
        contains: where,
        mode: "insensitive",
      },
    },
    orderBy: {
      Date: "desc",
    },
    select: {
      ...fields,
    },
  });

  if(result == null) {
    return {};
  }

  const resultValues = Object.values(result);

  const price = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  });


  if (typeof result == "object" && resultValues.length > 0) {
    resObj["price"] = price.format(resultValues[0]);
  } else {
    resObj["price"] = price.format(0);
  }

  if (typeof result == "object" && resultValues.length > 1) {
    resObj["change"] = Number(resultValues[1]).toFixed(1);
    resObj["changeVal"] = price.format(calculateChangeVal(Number(resultValues[0]), Number(resultValues[1])));

  } else {
    resObj["change"] = "0";
    resObj["changeVal"] = "0";
  }

  return resObj;
}
