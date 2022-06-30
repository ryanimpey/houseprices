import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";

import Map, { Source, Layer } from "react-map-gl";
import { bbox, center } from "@turf/turf";
import Select from "react-select";
import React, { useEffect, useState, useRef } from "react";
import toStartCase from 'lodash.startcase'
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

type SelectType = { label: string, value: string } | null;

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

  function onRegionChange({ value, label }: { value: string, label: string }) {
    let res = districts.findIndex((val) => val?.label == label);
    if(res === -1) {
      return toast.error("Invalid option selected");
    }

    setWhere(label);
    fetcher.submit({ region: value }, { method: "get" });
  }

  function buildParamString(): string | Id {
    if(where.length == 0) {
      return "";
    }
  
    if(districts.findIndex((val) => val?.label == where) === -1) {
      return toast.error("Invalid option selected");
    }

      return `where=${encodeURIComponent(where)}`
  }

  function checkValidData(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    if(districts.findIndex((val) => val?.label == where) === -1) {
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
              options={districts}
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
          {where.length > 0 && (
            <h3 className="pb-4 text-center font-sans text-2xl font-bold text-[#363636]">
              {toStartCase(where)}
            </h3>
          )}
        </div>
        <div className="text-center">
          <Link
            to={{pathname: "/what", search: buildParamString()}} onClick={checkValidData}
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
