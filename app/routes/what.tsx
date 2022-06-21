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
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return {
    title: "What | HousePrices",
  }
};

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

type SelectResult = {
  label?: string;
  value?: string;
};

export default function What() {
  const [property, setProperty] = useState<SelectResult>({});

  const onPropertyChange = (option: SelectResult) => setProperty(option);

  function buildParamString(): string {
    if (typeof document !== "undefined") {
      const url = new URLSearchParams(document?.location?.search ?? null);

      if (property.value != undefined) {
        url.set("type", property.value);
      }

      return url.toString();
    }
  }

  return (
    <main className="container flex h-full justify-center">
      <section className="flex max-w-md flex-col justify-center">
        <div>
          <h1 className="pb-4 text-left font-sans text-2xl font-bold text-[#363636]">
            What Type of Property?
          </h1>
            {typeof document != undefined && (
              <Select
                instanceId="select-what"
                name="property"
                placeholder="you need to type here"
                options={selectOptions}
                onChange={onPropertyChange}
                styles={selectStyle}
              />
            )}
        </div>
        <div className="my-8 flex h-96 justify-center">
          <img
            className="m-0 m-auto max-w-300"
            src="/images/undraw_handcrafts_city.svg"
          />
        </div>
        <div className="text-center">
          <Link
            to={{ pathname: "/results", search: buildParamString() }}
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
