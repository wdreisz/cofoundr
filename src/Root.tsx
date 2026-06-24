import { useEffect, useState } from "react";
import { App } from "./App";
import { Landing } from "./Landing";

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

  if (appView) return <App />;
  return <Landing onLaunch={() => { window.location.hash = "app"; }} />;
}
