import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { LoaderFunction, json } from "@remix-run/node";
import Button from "~/components/Button";

import Map, { Source, Layer, MapRef } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { bbox, center, Feature, Point, Properties } from "@turf/turf";
import { places } from "@prisma/client";
import { getPlaceGeo, getPlaceRegions } from "~/models/places.server";
import Select from "react-select";
import React, { useEffect, useState, useRef } from "react";
import { selectStyle } from "~/utils";

type LoaderData = { regions: Array<{}>; geojson?: any };

const selectOptions = [
  {
    label: "Detached",
    value: "detached",
  },
  {
    label: "Semi-Detached",
    value: "semi-detached",
  },
  {
    label: "Terraced",
    value: "terraced",
  },
  {
    label: "Flat/Apartment",
    value: "flat",
  },
];

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const region = url.searchParams.get("region");

  const data: LoaderData = {
    regions: await getPlaceRegions(),
  };

  if (region != null) {
    data["geojson"] = await getPlaceGeo(region);
  }

  return json(data);
};

export default function Where() {
  const fetcher = useFetcher();
  const selectRef = useRef<Select>();

  return (
    <main className="container flex h-full justify-center">
      <section className="flex max-w-md flex-col justify-center">
        <div>
          <h1 className="pb-4 text-left font-sans text-2xl font-bold text-[#363636]">
            Where Are We Buying?
          </h1>
          <fetcher.Form method="get" action="/where">
            <Select
              ref={selectRef}
              name="region"
              placeholder="you need to type here"
              options={selectOptions}
              onChange={(e) => console.log(e)}
              styles={selectStyle}
            />
          </fetcher.Form>
        </div>
        <div className="my-8 h-96 flex justify-center">
          <img
            className="m-0 m-auto max-w-300"
            src="/images/undraw_handcrafts_city.svg"
          />
        </div>
        <div className="text-center">
          <Link
            to="/"
            className="rounded-3xl border-8 border-[#36B3FF] bg-[#9bd9ff] px-20 py-2 font-sans font-bold text-[#363636] shadow-custom"
          >
            next
          </Link>
        </div>
      </section>
    </main>
  );
}

export const links = () => [
  {
    rel: "preload",
    href: "/images/undraw_handcrafts_city.svg",
    as: "image",
    type: "image/svg+xml",
  },
];
