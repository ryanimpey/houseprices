import type { prices } from "@prisma/client";

import { prisma } from "~/db.server";
import { PropertyType, PropertyTypeResult } from "~/utils";

type PropertyPriceType = "Semi_Detached_Average_Price" | "Detached_Average_Price";
type TypeFieldResult = { [key: string]: boolean };

interface ChartResult {
  date: string,
  [key: PropertyPriceType]: number,
};

function typeToRecentPriceTypeFields(
  type: PropertyType | null
): TypeFieldResult {
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

function typeToPropertyPriceField(type: PropertyType | null): TypeFieldResult {
  switch (type) {
    case "detached":
      return {
        Detached_Average_Price: true,
      };
    case "semi-detached":
      return {
        Semi_Detached_Average_Price: true,
      };
    case "terraced":
      return { Terraced_Average_Price: true };
    case "flat":
      return { Flat_Average_Price: true };
    default:
      return { Flat_Average_Price: true };
  }
}

function calculateChangeVal(price: number, percentage: number): number {
  let totalPercentage = Number(percentage.toPrecision(2)) + 100;
  let prevPrice = (price / totalPercentage) * 100;
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

function mapResultsToUniform(results: Array<PropertyPriceType>) {
  let values = Object.values(results);
  return { date: values[0].substring(0, 4), price: values[1]};
}

export async function getPriceOverTime(
  where: string | null,
  type: PropertyType | null
): Promise<any | null> {
  const propertyField = typeToPropertyPriceField(type);

  const result: Array<ChartResult> = await prisma.prices.findMany({
    where: {
      Region_Name: {
        contains: where,
        mode: "insensitive",
      },
      Date: {
        contains: "01-01",
        mode: "insensitive",
      },
    },
    orderBy: {
      Date: "asc",
    },
    select: {
      Date: true,
      ...propertyField
    },
  });

  return result.map(mapResultsToUniform);
}

export async function getRecentPropertyPriceByArea(
  where: string | null,
  type: PropertyType | null
): Promise<PropertyTypeResult | null> {
  const resObj: PropertyTypeResult = {};
  const fields = typeToRecentPriceTypeFields(type);

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

  if (result == null) {
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
    const changeValue = calculateChangeVal(
      Number(resultValues[0]),
      Number(resultValues[1])
    );
    resObj["change"] = Number(resultValues[1]).toFixed(1);
    resObj["changeVal"] = price.format(changeValue);
    resObj["changeStr"] = changeValue > 0 ? "up" : "down";
  } else {
    resObj["change"] = "0";
    resObj["changeVal"] = "0";
    resObj["changeStr"] = "up";
  }

  return resObj;
}
