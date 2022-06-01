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

const capitalize = (s: string) => {
  return String(s.charAt(0).toUpperCase() + s.slice(1)).replace(/_/g, " ");
};

export default function Where() {
  const fetcher = useFetcher();
  const selectRef = useRef<Select>();
  const mapRef = useRef<MapRef>();
  const [hasPoly, setPoly] = useState(false);
  const [centre, setCentre] = useState<Feature<Point, Properties>>({
    type: "Feature",
    geometry: { coordinates: [0,0] },
  });
  const { regions } = useLoaderData<LoaderData>();
  const selectOptions = regions.flatMap((x) => ({
    value: x.region,
    label: capitalize(x.region),
  }));

  function onRegionChange({ value }: { value: string }) {
    fetcher.submit({ region: value }, { method: "get" });
  }

  useEffect(() => {
    if (fetcher.type == "done" && fetcher.data?.geojson) {
      setPoly(true);
      setCentre(center(fetcher.data.geojson.geometry));
      const [minLng, minLat, maxLng, maxLat] = bbox(fetcher.data.geojson.geometry);
      mapRef.current?.fitBounds([
        [minLng, minLat],
        [maxLng, maxLat]
      ],
      {padding: 10, duration: 0});
    }
  }, [fetcher.type]);

  if(selectRef.current != null) {
    console.log(selectRef.current.getValue()[0]);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white">
      <div>
        <h1 className="text--subtitle text--cabin--bold">
          where are we buying?
        </h1>
        <fetcher.Form method="get" action="/where">
          <Select
            ref={selectRef}
            name="region"
            placeholder="you need to type here"
            options={selectOptions}
            onChange={onRegionChange}
          />
        </fetcher.Form>
      </div>
      <div style={{ overflow: "hidden", width: 300, height: 300 }}>
        <Map
          ref={mapRef}
          mapboxAccessToken={accessToken}
          initialViewState={{
            longitude: centre.geometry.coordinates[0],
            latitude: centre.geometry.coordinates[1],
            zoom: 11
          }}
          scrollZoom={true}
          dragPan={true}
          dragRotate={false}
          style={{ width: 300, height: 300 }}
        >
          {fetcher.type == "done" && hasPoly && (
            <React.Fragment>

            <Source id="region" type="geojson" data={{...geo, ...fetcher.data.geojson}}>
              <Layer {...layerStyle}></Layer>
            </Source>
            </React.Fragment>
          )}
        </Map>
      </div>
      <div className="mt-8 pt-8">
        <a href="/where" className="button--primary text--cabin--bold py-1">
          Helloooo
        </a>
      </div>
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
