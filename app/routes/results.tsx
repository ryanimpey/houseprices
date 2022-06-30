import { Link, useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";

import type { PropertyType, PropertyTypeResult} from "~/utils";
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

  if(where == null || type == null) {
    return redirect("/where");
  }

  const data: LoaderData = {
    where,
    type: getPresentableTypeString(type),
    values: await getRecentPropertyPriceByArea(where, type),
    chart: await getPriceOverTime(where, type),
  };

  if(!data.values?.price) {
    return redirect(`/error?${url.searchParams.toString()}`);
  }

  return json(data);
};

export default function Results() {
  const { values, where, type, chart } = useLoaderData<LoaderData>();

  return (
    <main className="container flex justify-center my-8">
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
              alt="Indicator of positive or negative property growth"
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
        <div>
          <p className="px-2">
            <small>Source: Office for National Statistics licensed under the Open Government Licence v.3.0<br />
Contains OS data © Crown copyright and database right {new Date().getFullYear()}</small>
          </p>
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
