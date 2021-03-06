import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { LoaderFunction, json } from "@remix-run/node";
import Button from "~/components/Button";

import Map, { Source, Layer, MapRef } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { bbox, center, Feature, Point, Properties } from "@turf/turf";
import { places } from "@prisma/client";
import { getPlaceGeo, getPlaceRegions } from "~/models/places.server";
import Select, { StylesConfig } from "react-select";
import React, { useEffect, useState, useRef } from "react";
import toStartCase from 'lodash.startcase'
import { selectStyle } from "~/utils";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return {
    title: "Where | HousePrices",
  }
};


const accessToken =
  "pk.eyJ1IjoiaW1wZXlyeWFuIiwiYSI6ImNsMnJwNHNtdzMxN3gzbW83eTN1Z3N0eXEifQ.7oi4oIJOhiZtGDOLFWt0Dw";

const geo = {
  type: "Feature",
};

const layerStyle = {
  id: "region",
  type: "fill",
  paint: {
    "fill-color": "#363636",
  },
};

type LoaderData = { regions: Array<{}>; geojson?: any };

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
  const mapRef = useRef<MapRef>();
  const [hasPoly, setPoly] = useState(false);
  const [centre, setCentre] = useState<Feature<Point, Properties>>({
    type: "Feature",
    geometry: { coordinates: [0, 0] },
  });
  const { regions } = useLoaderData<LoaderData>();
  const selectOptions = regions.flatMap((x) => ({
    value: x.region,
    label: toStartCase(x.region),
  }));

  function onRegionChange({ value }: { value: string }) {
    fetcher.submit({ region: value }, { method: "get" });
  }

  function buildParamString(): string {
    let {_, value} = selectRef?.current?.getValue()[0] ?? {};

    if(typeof value == "string") {
      return `where=${value}`
    }

    return '';
  }

  useEffect(() => {
    if (fetcher.type == "done" && fetcher.data?.geojson) {
      setPoly(true);
      setCentre(center(fetcher.data.geojson.geometry));
      const [minLng, minLat, maxLng, maxLat] = bbox(
        fetcher.data.geojson.geometry
      );
      mapRef.current?.fitBounds(
        [
          [minLng, minLat],
          [maxLng, maxLat],
        ],
        { padding: 40, duration: 0 }
      );
    }
  }, [fetcher.type]);

  let {label, _} = selectRef?.current?.getValue()[0] ?? {};

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
              onChange={onRegionChange}
              styles={selectStyle}
            />
          </fetcher.Form>
        </div>
        <div className="h-96 my-8">
          <Map
            ref={mapRef}
            mapboxAccessToken={accessToken}
            initialViewState={{
              longitude: centre.geometry.coordinates[0],
              latitude: centre.geometry.coordinates[1],
              zoom: 11,
            }}
            scrollZoom={false}
            dragPan={false}
            dragRotate={false}
            style={{ width: 300, height: 300 }}
          >
            {fetcher.type == "done" && hasPoly && (
              <React.Fragment>
                <Source
                  id="region"
                  type="geojson"
                  data={{ ...geo, ...fetcher.data.geojson }}
                >
                  <Layer {...layerStyle}></Layer>
                </Source>
              </React.Fragment>
            )}
          </Map>
          {label && (
            <h3 className="pb-4 text-center font-sans text-2xl font-bold text-[#363636]">
              {toStartCase(label)}
            </h3>
          )}
        </div>
        <div className="text-center">
          <Link
            to={{pathname: "/what", search: buildParamString()}}
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
    href: "/images/undraw_handcrafts_house.svg",
    as: "image",
    type: "image/svg+xml",
  },
];
