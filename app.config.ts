import "dotenv/config";
import { ExpoConfig, ConfigContext } from "@expo/config";

process.env.EXPO_ROUTER_APP_ROOT = "../../src/app";

export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    name: "sirdab-app",
    slug: "sirdab-app",
    version: "1.0.0",
    extra: {
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseDatabaseURL: process.env.FIREBASE_DATABASE_URL,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
    },
  };
};
