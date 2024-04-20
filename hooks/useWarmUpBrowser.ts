import { useEffect } from "react";
import * as WebBrowser from "expo-web-browser";

// For Android Performance
// I was planning on using this with Clerk OAuth with google authentication and what not
// to speed the performance of the browser in Android but not doing that anymore
export const useWarmUpBrowser = () => {
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};
