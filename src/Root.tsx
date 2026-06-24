import { useEffect, useState } from "react";
import { App } from "./App";
import { AppConvex } from "./AppConvex";
import { Landing } from "./Landing";
import { CofoundrProviders, convexConfigured } from "./convex";

const isAppRoute = () => window.location.hash.replace(/[#/]/g, "") === "app";

export function Root() {
  const [appView, setAppView] = useState(isAppRoute);

  useEffect(() => {
    const onHash = () => {
      setAppView(isAppRoute());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return (
    <CofoundrProviders>
      {appView ? (
        convexConfigured ? <AppConvex /> : <App />
      ) : (
        <Landing onLaunch={() => { window.location.hash = "app"; }} />
      )}
    </CofoundrProviders>
  );
}
