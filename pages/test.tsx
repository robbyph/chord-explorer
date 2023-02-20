import React from "react";
import HamburgerMenu, { Links } from "../components/hamburger.js";

export default function Test() {
  return (
    <div className="max-w-full h-24 flex justify-start items-center bg-white mb-4 text-black">
      <div className="flex md:hidden">
        <HamburgerMenu />
      </div>
      <div className="hidden md:flex">
        <Links />
      </div>
    </div>
  );
}
