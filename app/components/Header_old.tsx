import { Link } from "@remix-run/react";
import React from "react";

function Header() {
  return (
    <section className="flex justify-center py-4 px-2">
      <div className="w-full max-w-md">
        <ul className="flex w-full items-center justify-between">
          <li>
            <Link to="/">
            <img
              alt="Drawing of a house"
              className="m-0 m-auto max-h-8"
              src="/images/undraw_handcrafts_house.svg"
              />
              </Link>
          </li>
          <div className="inline-flex">
            <li className="px-2">
              <Link to="/home">
                <b>Home</b>
              </Link>
            </li>
            <li className="px-2">
              <Link to="/blog">
                <b>Blog</b>
              </Link>
            </li>
            <li className="px-2">
              <Link to="/about">
                <b>About</b>
              </Link>
            </li>
          </div>
        </ul>
      </div>
    </section>
  );
}

export default Header;
