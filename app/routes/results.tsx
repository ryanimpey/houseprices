import { Link, useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";

import type { PropertyType, PropertyTypeResult } from "~/utils";
import {
  getPriceOverTime,
  getPresentableTypeString,
  getRecentPropertyPriceByArea,
  getPriceOverYear,
} from "~/models/property_prices.server";
import Chart from "~/components/Chart";
import type { MetaFunction } from "@remix-run/node";
import React from "react";

export const meta: MetaFunction = () => {
  return {
    title: "Results | HousePrices",
  };
};

type LoaderData = {
  values: PropertyTypeResult;
  type: PropertyType | null;
  where: string | null;
  timeChart: Array<any> | null;
  yearChart: Array<any> | null;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const where = url.searchParams.get("where");
  const type: PropertyType | null = url.searchParams.get("type");

  if (where == null || type == null) {
    return redirect("/where");
  }

  const data: LoaderData = {
    where,
    type: getPresentableTypeString(type),
    values: await getRecentPropertyPriceByArea(where, type),
    timeChart: await getPriceOverTime(where, type),
    yearChart: await getPriceOverYear(where, type),
  };

  if (!data.values?.price) {
    return redirect(`/error?${url.searchParams.toString()}`);
  }

  return json(data);
};

export default function Results() {
  const { values, where, type, timeChart, yearChart } = useLoaderData<LoaderData>();

  return (
    <React.Fragment>
      <div className="background--clip fixed -z-10 h-full w-full bg-[#E9F4FF]" />
      <main className="py-24">
        <section className="flex h-full items-end justify-center lg:h-1/2">
          <div className="mt-8 max-w-sm px-4 pr-8 lg:max-w-md">
            <h1 className="pb-4 text-2xl font-bold">Your Results</h1>
            <p className="mb-6">
              Here's what we've found. The data you're currently looking at is
              the most recent price of <b>{type}</b> in <b>{where}</b>. If you'd
              like to view data for other property types or areas you can do
              that{" "}
              <Link to="/">
                <b className="text-[#36B3FF]">here</b>.
              </Link>
            </p>
            <div className="pt-6 pb-4">
              <h3 className="pb-2 text-left font-sans text-2xl font-bold text-[#363636]">
                This property might cost you
              </h3>
              <h1 className="inline-block border-b-4 border-[#36B3FF] pb-2 pr-2 text-left font-sans text-4xl font-bold text-[#363636]">
                {values.price}
              </h1>
            </div>
            <p className="py-2">
              The price of property across the country is constantly changing.
              Depending on a range of economic and non-economic factors, the
              value of a property may rapidly fluctuate in a short amount of
              time. Here's all the data we have from this year.
            </p>
            <div className="py-6">
              <h3 className="pb-2 text-left font-sans text-2xl font-bold text-[#363636]">
                This is{" "}
                <span
                  className={`text-${
                    values.changeStr === "up" ? "green" : "red"
                  }-600`}
                >
                  {values.changeStr}
                </span>
                &nbsp;from last month by
              </h3>
              <div className="direction-row flex items-center">
                <img
                  alt="Indicator of positive or negative property growth"
                  className="inline-block max-h-14"
                  src={
                    values.changeStr === "up"
                      ? "/images/bar_green.svg"
                      : "/images/bar_red.svg"
                  }
                />
                <h1 className="inline-block pb-2 pl-4 pr-2 text-left font-sans text-4xl font-bold">
                  {values.change}%
                </h1>
                <h3 className="text-1xl inline-block pb-2 pb-0 text-left font-sans font-bold text-[#363636]">
                  ({values.changeVal})
                </h3>
              </div>
            </div>
            <div className="mb-8 pt-6">
              <h3 className="mb-6 text-left font-sans text-2xl font-bold text-[#363636]">
                Price changes this year
              </h3>
              <Chart data={yearChart} small />
            </div>
            <hr />
            <p className="py-2">
              Across the developed world, the price of property is continuously rising, due to a lack of supply, and an increased demand. Here's how the price of this property has changed back to when Office for National Statistics records began in 1995.
            </p>
            <div className="mb-8 py-6">
              <h3 className="pb-2 text-left font-sans text-2xl font-bold text-[#363636]">
                Price changes since 1995
              </h3>
              <Chart data={timeChart} />
            </div>
            <div>
              <p className="px-2">
                <small>
                  Source: Office for National Statistics licensed under the Open
                  Government Licence v.3.0
                  <br />
                  Contains OS data © Crown copyright and database right{" "}
                  {new Date().getFullYear()}
                </small>
              </p>
            </div>
          </div>
        </section>
      </main>
    </React.Fragment>
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
