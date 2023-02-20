import React from "react";
import HamburgerMenu, { Links } from "../components/hamburger.js";

export default function Test() {
  return (
    <div className="max-w-full h-12 flex justify-start items-center bg-black mb-4 text-white rounded-md ">
      <div className="flex md:hidden">
        <HamburgerMenu />
      </div>
      <div className="hidden md:flex">
        <Links />
      </div>
    </div>
  );
}
