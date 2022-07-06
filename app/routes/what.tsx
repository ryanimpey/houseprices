import { Link } from "@remix-run/react";
import Select from "react-select";
import React, { useState } from "react";
import { selectStyle } from "~/utils";
import { redirect } from "@remix-run/node";
import { toast } from "react-toastify";

import type { LoaderFunction, MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return {
    title: "What | HousePrices",
  };
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

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const where = url.searchParams.get("where");

  if (where === null) {
    return redirect("/where");
  }

  return null;
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

    return "";
  }

  function checkValidData(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    if (selectOptions.findIndex((val) => val?.value == property.value) === -1) {
      toast.info("No property type has been recorded");
      return e.preventDefault();
    }
  }

  return (
    <React.Fragment>
      <div className="background--clip fixed -z-10 h-full w-full bg-[#E9F4FF]" />
      <main className="h-full">
        <section className="flex h-full items-center justify-center flex-col">
          <div className="mt-8 max-w-sm px-4 pr-8 lg:max-w-md">
            <h1 className="pb-4 text-2xl font-bold">What are we buying?</h1>
            <p className="mb-8">
              You may have heard that when you buy a house, you're paying for
              more than just the walls and the flooring. You're also buying a
              lot of land—and that can mean paying more for your home than you
              would for an apartment.
            </p>
            <p className="mb-4">
              {typeof document !== "undefined" && (
                <Select
                  instanceId="select-what"
                  name="property"
                  placeholder="you need to type here"
                  options={selectOptions}
                  onChange={onPropertyChange}
                  styles={selectStyle}
                />
              )}
            </p>
          </div>
          <div className="text-center my-6">
            <Link
              to={{ pathname: "/results", search: buildParamString() }}
              onClick={checkValidData}
              className="inline-block rounded-md bg-[#607FF2] py-3 px-8 font-bold tracking-widest text-white"
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
    href: "/images/undraw_handcrafts_city.svg",
    as: "image",
    type: "image/svg+xml",
  },
];
