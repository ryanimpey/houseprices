import { Link } from "@remix-run/react";
import Button from "~/components/Button";

import { useOptionalUser } from "~/utils";

export default function Index() {
  const user = useOptionalUser();
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center">
      <img
        className="main--svg--house mb-8 py-8"
        src="/images/undraw_handcrafts_house.svg"
      />
      <div>
        <h1 className="text--title text-center pb-2">local housing data</h1>
        <p className="text--body main--text--container">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </p>
      </div>
      <div className="pt-8 mt-8">
        <Button>get started</Button>
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
