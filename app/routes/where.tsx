import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";

import Map, { Source, Layer } from "react-map-gl";
import { bbox, center } from "@turf/turf";
import Select from "react-select";
import React, { useEffect, useState, useRef } from "react";
import toStartCase from "lodash.startcase";
import { selectStyle } from "~/utils";
import type { MetaFunction } from "@remix-run/node";
import { getDistricts } from "~/models/districts.server";
import { getGeojsonById } from "~/models/geojson.server";

import type { MapRef } from "react-map-gl";
import type { LoaderFunction } from "@remix-run/node";
import type { Feature, Point, Properties } from "@turf/turf";
import { Id, toast } from "react-toastify";

export const meta: MetaFunction = () => {
  return {
    title: "Where | HousePrices",
  };
};

const accessToken =
  "pk.eyJ1IjoiaW1wZXlyeWFuIiwiYSI6ImNsNTFhejhmaTAzd3EzYnFxNHdlYnp5dTkifQ.DOAO4_xK_99zVGEfW6pJUw";

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

type SelectType = { label: string; value: string } | null;

type LoaderData = { districts: Array<SelectType>; geojson?: any };

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const region = url.searchParams.get("region");

  const data: LoaderData = {
    districts: await getDistricts(),
  };

  if (region != null) {
    data["geojson"] = await getGeojsonById(region);
  }

  return json(data);
};

export default function Where() {
  const fetcher = useFetcher();
  const selectRef = useRef<Select>();
  const mapRef = useRef<MapRef>();
  const [where, setWhere] = useState("");
  const [hasPoly, setPoly] = useState(false);
  const [centre, setCentre] = useState<Feature<Point, Properties>>({
    type: "Feature",
    geometry: { coordinates: [0, 0] },
  });

  const { districts } = useLoaderData<LoaderData>();

  function onRegionChange({ value, label }: { value: string; label: string }) {
    let res = districts.findIndex((val) => val?.label == label);
    if (res === -1) {
      return toast.error("Invalid option selected");
    }

    setWhere(label);
    fetcher.submit({ region: value }, { method: "get" });
  }

  function buildParamString(): string | Id {
    if (where.length == 0) {
      return "";
    }

    if (districts.findIndex((val) => val?.label == where) === -1) {
      return toast.error("Invalid option selected");
    }

    return `where=${encodeURIComponent(where)}`;
  }

  function checkValidData(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    if (districts.findIndex((val) => val?.label == where) === -1) {
      toast.info("No where option has been recorded.");
      return e.preventDefault();
    }
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
  }, [fetcher.type, fetcher.data?.geojson]);

  return (
    <React.Fragment>
      <div className="background--clip fixed -z-10 h-full w-full bg-[#E9F4FF]" />
      <main className="py-24">
        <section className="flex h-1/2 justify-center items-end">
          <div className="mt-8 max-w-sm px-4 pr-8 lg:max-w-md">
            <h1 className="pb-4 text-2xl font-bold">Where are we buying?</h1>
            <p className="mb-6">
              House prices in the north of England have always been lower than
              those in the south, but the gap has widened in recent years. By
              selecting the region you’re buying in, we can provide you with the
              most accurate result for the cost of a property in your area.
            </p>
            <p className="mb-4">
              <fetcher.Form method="get" action="/where">
                <Select
                  ref={selectRef}
                  name="region"
                  placeholder="you need to type here"
                  options={districts}
                  onChange={onRegionChange}
                  styles={selectStyle}
                />
              </fetcher.Form>
            </p>
          </div>
        </section>
        <section>
        <div className="flex flex-col justify-center items-center mb-4 h-96">
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
          {where.length > 0 && (
            <h3 className="pb-4 text-center font-sans text-2xl font-bold text-[#363636]">
              {toStartCase(where)}
            </h3>
          )}
        </div>
        <div className="text-center">
          <Link
            to={{pathname: "/what", search: buildParamString()}} onClick={checkValidData}
            className="bg-[#607FF2] inline-block py-3 px-8 font-bold text-white tracking-widest rounded-md"
          >
            next
          </Link>
        </div>
        </section>
      </main>
    </React.Fragment>
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
