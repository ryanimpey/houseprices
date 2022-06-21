import { Link } from "@remix-run/react";
import Button from "~/components/Button";

export default function Index() {
  return (
    <main className="container flex h-full justify-center">
      <section className="flex max-w-md flex-col justify-center">
        <div className="py-8">
          <img
            className="m-0 m-auto max-h-56"
            src="/images/undraw_handcrafts_house.svg"
          />
        </div>
        <div className="mt-4 pt-8">
          <h1 className="font-sans font-bold text-4xl text-[#363636] text-center pb-4">local housing data</h1>
          <p className="font-sans text-[#363636] text-center leading-5 max-w-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
        </div>
        <div className="mt-8 pt-8 text-center">
          <Link to="/where" className="translate-x-2 font-sans text-[#363636] px-20 shadow-custom py-2 font-bold hover:shadow-custom-hover border-8 border-[#36B3FF] bg-[#9bd9ff] rounded-3xl">get started</Link> 
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
