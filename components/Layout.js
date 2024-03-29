import Header from '../components/Header';
import HamburgerMenu, { Links } from '../components/hamburger.js';
import Navigation from '../components/Navigation';
import { Footer } from '../components/Footer';

const Layout = ({ children }) => {
  return (
    <>
      <meta content='width=device-width, initial-scale=1' name='viewport' />
      <div className='h-screen min-h-screen overflow-auto'>
        <div className='min-[60px]:max-[1279px]:hidden min-[1280px]:visible flex items-center pb-14 pt-6 flex-row relative h-fit w-full before:p-0 before:m-0 overflow-hidden before:rounded-[100%] before:absolute before:bg-white before:top-[-550px] before:bottom-0 before:left-[-40%] before:right-[-20%]'>
          <Header></Header>
          <Navigation></Navigation>
        </div>
        <div className='py-4 min-[60px]:max-[1279px]:visible min-[1280px]:hidden flex items-center flex-row relative h-fit w-full before:p-0 before:m-0 overflow-hidden before:absolute before:bg-white before:top-[-600px] before:bottom-0 before:left-[-40%] before:right-[-30%]'>
          <HamburgerMenu />
          <Header></Header>
        </div>
        <main>{children}</main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
