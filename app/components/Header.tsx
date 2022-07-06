import { Link } from "@remix-run/react";
import React from "react";

function Header() {
  return (
    <nav className="absolute w-full z-10 p-4 lg:p-8">
      <ul className="flex justify-between">
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
