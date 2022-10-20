import Navigation from '../components/Navigation';

const Layout = ({ children }) => {
  return (
    <>
      <meta content='width=device-width, initial-scale=1' name='viewport' />
      <div>
        <div>
          <Navigation></Navigation>
        </div>
        <main>{children}</main>
      </div>
    </>
  );
};

export default Layout;
