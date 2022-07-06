import { Link } from "@remix-run/react";
import React from "react";

function Header() {
  return (
    <nav className="fixed top-0 w-full z-10 lg:h-20 bg-[#E9F4FF] lg:bg-transparent">
      <ul className="flex justify-between p-8">
        <li>
          <Link to="/" className="flex">
          <img
              alt="Icon of a house"
              className="inline -mt-2 pr-2 w-full w-11 lg:w-16 lg:-mt-3"
              src="/images/building.svg"
              />
              <span>
              <strong className="lg:text-4xl">House</strong>
              <span className="lg:text-4xl">Data</span>
              </span>
          </Link>
        </li>
        <li>
          <Link to="/blog" className="font-bold text-lg">Blog</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Header;
