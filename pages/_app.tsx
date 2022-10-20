import '../styles/globals.css'
import Layout from "../components/Layout";
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className='bg-[#5B21B6] min-h-screen'>
        <Layout>
            <Component  {...pageProps} />
        </Layout>
    </div>
)}

export default MyApp
