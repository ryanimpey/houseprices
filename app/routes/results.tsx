import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { LoaderFunction, json } from "@remix-run/node";
import Button from "~/components/Button";

import Map, { Source, Layer, MapRef } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { bbox, center, Feature, Point, Properties } from "@turf/turf";
import { places, prices } from "@prisma/client";
import Select from "react-select";
import React, { useEffect, useState, useRef } from "react";
import { PropertyType, PropertyTypeResult, selectStyle } from "~/utils";
import toStartCase from "lodash.startcase";
import {
  getPriceOverTime,
  getPresentableTypeString,
  getRecentPropertyPriceByArea,
} from "~/models/property_prices.server";
import Chart from "~/components/Chart";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return {
    title: "Results | HousePrices",
  }
};

type LoaderData = {
  values: PropertyTypeResult;
  type: PropertyType | null;
  where: string | null;
  chart: Array<any> | null;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const where = url.searchParams.get("where");
  const type: PropertyType | null = url.searchParams.get("type");

  const data: LoaderData = {
    type: getPresentableTypeString(type),
    where: toStartCase(where),
    values: await getRecentPropertyPriceByArea(where, type),
    chart: await getPriceOverTime(where, type),
  };

  return json(data);
};

export default function Results() {
  const { values, where, type, chart } = useLoaderData<LoaderData>();
  return (
    <main className="container flex h-full justify-center">
      <section className="flex max-w-md flex-col justify-center">
        <div className="pb-6">
          <h1 className="pb-4 text-left font-sans text-3xl font-bold text-[#363636]">
            Your Results
          </h1>
          <p className="max-w-sm text-left font-sans leading-5 text-[#363636]">
            You’re looking at data for <strong>{type}</strong> in{" "}
            <strong>{where}</strong>.{" "}
            <Link to="/">
              <em className="text-[#36B3FF]">change this</em>
            </Link>
          </p>
        </div>
        <div className="py-6">
          <h3 className="pb-2 text-left font-sans text-2xl font-bold text-[#363636]">
            This property might cost you
          </h3>
          <h1 className="inline-block border-b-4 border-[#36B3FF] pb-2 pr-2 text-left font-sans text-4xl font-bold text-[#363636]">
            {values.price}
          </h1>
        </div>
        <div className="py-6">
          <h3 className="pb-2 text-left font-sans text-2xl font-bold text-[#363636]">
            This is <span className={`text-${values.changeStr === "up" ? "green" : "red"}-600`}>{values.changeStr}</span>
            &nbsp;from last month by
          </h3>
          <div className="direction-row flex items-center">
            <img
              className="inline-block max-h-14"
              src={values.changeStr === "up" ? "/images/bar_green.svg": "/images/bar_red.svg"}
            />
            <h1 className="inline-block pb-2 pl-4 pr-2 text-left font-sans text-4xl font-bold">
              {values.change}%
            </h1>
            <h3 className="text-1xl inline-block pb-2 pb-0 text-left font-sans font-bold text-[#363636]">
              ({values.changeVal})
            </h3>
          </div>
        </div>
        <div className="py-6 mb-8">
          <h3 className="pb-2 text-left font-sans text-2xl font-bold text-[#363636]">
            How prices have changed since 1995
          </h3>
          <Chart data={chart} />
        </div>
      </section>
    </main>
  );
}

export const links = () => [
  {
    rel: "preload",
    href: "/images/bar_green.svg",
    as: "image",
    type: "image/svg+xml",
  },
  {
    rel: "preload",
    href: "/images/bar_red.svg",
    as: "image",
    type: "image/svg+xml",
  },
];
