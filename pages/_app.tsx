import "../styles/globals.css";
import Layout from "../components/Layout";
import type { AppProps } from "next/app";
import { AuthContextProvider } from "../context/AuthContext";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <div className="bg-[#5B21B6] min-h-screen">
            <AuthContextProvider>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </AuthContextProvider>
        </div>

    );
}

export default MyApp;
