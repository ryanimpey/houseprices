import { Link } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return {
    title: "Get Started | HousePrices",
    description:
      "Find out how much housing costs in and around your area. Showing results for all housing types back to 1990",
  };
};

export default function Index() {
  return (
    <main className="container flex h-full justify-center">
      <section className="flex max-w-md flex-col justify-center">
        <div className="py-8">
          <img
            alt="Drawing of a house"
            className="m-0 m-auto max-h-56"
            src="/images/undraw_handcrafts_house.svg"
          />
        </div>
        <div className="mt-4 pt-8">
          <h1 className="pb-4 text-center font-sans text-4xl font-bold text-[#363636]">
            local housing data
          </h1>
          <p className="max-w-sm px-3 text-center font-sans leading-5 text-[#363636]">
            Find out how much pricing for housing has changed in your area, or
            across the UK. Search by region and property type, and view house
            price data back to 1995 to see how prices today relate to yesterday.
          </p>
        </div>
        <div className="mt-8 pt-8 text-center">
          <Link
            to="/where"
            className="translate-x-2 rounded-3xl border-8 border-[#36B3FF] bg-[#9bd9ff] px-20 py-2 font-sans font-bold text-[#363636] shadow-custom"
          >
            get started
          </Link>
        </div>
        <div className="mt-8 pt-8 text-center">
          <p><small>&copy; copyright {new Date().getFullYear()} housedata.uk</small></p>
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
