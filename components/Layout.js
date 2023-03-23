import Navigation from "../components/Navigation";
import Header from "../components/Header";
import HamburgerMenu, { Links } from "../components/hamburger.js";

const Layout = ({ children }) => {
  return (
    <>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <div>
        <div className="min-[60px]:max-[1450px]:hidden min-[1451px]:visible flex items-center pb-14 pt-6 flex-row relative h-fit w-full before:p-0 before:m-0 overflow-hidden before:rounded-[100%] before:absolute before:bg-white before:top-[-550px] before:bottom-0 before:left-[-40%] before:right-[-20%]">
          <Header></Header>
          <Navigation></Navigation>
        </div>
        <div className="min-[60px]:max-[1450px]:visible min-[1451px]:hidden flex items-center pb-6 pt-6 flex-row relative h-fit w-full before:p-0 before:m-0 overflow-hidden before:absolute before:bg-white before:top-[-550px] before:bottom-0 before:left-[-40%] before:right-[-20%]">
          <HamburgerMenu />
          <Header></Header>
          <Links />
        </div>
        <main>{children}</main>
      </div>
    </>
  );
};

export default Layout;
