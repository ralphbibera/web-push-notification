import {
  getApp,
  initializeApp,
  getApps,
  applicationDefault,
} from "firebase-admin/app";

const app =
  getApps().length > 0
    ? getApp("admin")
    : initializeApp({ credential: applicationDefault() }, "admin");

export { app };
