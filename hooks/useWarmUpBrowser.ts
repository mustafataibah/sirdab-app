import { useEffect } from "react";
import * as WebBrowser from "expo-web-browser";

// For Android Performance
export const useWarmUpBrowser = () => {
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};
