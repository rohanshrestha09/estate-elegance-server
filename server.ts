import express from "express";
import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import * as dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import bodyParser from "body-parser";
import authRoute from "./routes/auth";
import userRoute from "./routes/user";
import propertyRoute from "./routes/property";

dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(cookieParser());

app.use(fileUpload());

app.use(bodyParser.json());

initializeApp({
  credential: cert({
    type: "service_account",
    project_id: "estate-elegance",
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: process.env.PRIVATE_KEY?.split(String.raw`\n`).join("\n"),
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
  } as ServiceAccount),
  storageBucket: "gs://estate-elegance.appspot.com",
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000, // 100
  standardHeaders: true,
  legacyHeaders: false,
});

(BigInt.prototype as any)["toJSON"] = function () {
  return this.toString();
};

app.use(limiter);

app.use("/api", userRoute);

app.use("/api", authRoute);

app.use("/api", propertyRoute);

app.listen(5000);
