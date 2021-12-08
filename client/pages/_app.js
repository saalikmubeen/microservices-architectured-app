import App from "next/app";
import "bootstrap/dist/css/bootstrap.css";
import Header from "../components/Header";
import buildClient from "../buildClient";

function MyApp({ Component, pageProps, currentUser }) {
    return (
        <>
            <Header currentUser={currentUser} />
            <div className="container">
                <Component {...pageProps} currentUser={currentUser} />
            </div>
        </>
    );
}

MyApp.getInitialProps = async (appContext) => {
    const appProps = await App.getInitialProps(appContext);
    const { req } = appContext.ctx;
    let data;

    const request = buildClient(req);

    const res = await request.get("/api/users/currentUser");

    return { ...appProps, currentUser: res.data.currentUser };

    // console.log(req.headers);

    // await axios.get(
    //     "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentUser",
    //     {
    //         headers: {
    //             host: req.headers.host, // "ticketing.dev"
    //             cookie: req.headers.cookie,
    //         },
    //     }
    // );
};

export default MyApp;
