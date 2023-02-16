import Navigation from "../components/Navigation";
import Header from "../components/Header";

const Layout = ({ children }) => {
  return (
    <>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <div>
        <div className="min-[60px]:max-[1400px]:hidden xl:visible flex items-center pb-14 pt-6 flex-row relative h-fit w-full before:p-0 before:m-0 overflow-hidden before:rounded-[100%] before:absolute before:bg-white before:top-[-550px] before:bottom-0 before:left-[-40%] before:right-[-20%]">
          <Header></Header>
          <Navigation></Navigation>
        </div>
        <main>{children}</main>
      </div>
    </>
  );
};

export default Layout;
