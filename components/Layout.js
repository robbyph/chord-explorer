import Navigation from '../components/Navigation';
import Header from '../components/Header';

const Layout = ({ children }) => {
  return (
    <>
      <meta content='width=device-width, initial-scale=1' name='viewport' />
      <div>
        <div className='flex flex-row p-2 text-black bg-white'>
          <Header></Header>
          <Navigation></Navigation>
        </div>
        <main>{children}</main>
      </div>
    </>
  );
};

export default Layout;
