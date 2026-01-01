import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();

app.use(
  "/api",
  createProxyMiddleware({
    target: "https://respond-io-fe-bucket.s3.ap-southeast-1.amazonaws.com",
    changeOrigin: true,
    pathRewrite: {
      "^/api": "",
    },
  })
);

export default app;
