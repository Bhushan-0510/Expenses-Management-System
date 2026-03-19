const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const { notFoundHandler, errorHandler } = require("./middlewares/errorMiddleware");

const app = express();

// Configure CORS explicitly so the frontend can send Authorization header
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: process.env.CORS_ALLOW_CREDENTIALS === "true"
};
app.use(cors(corsOptions));
// Ensure preflight requests are handled
app.options("*", cors(corsOptions));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

// Swagger / OpenAPI
const openApiPath = path.join(__dirname, "openapi.json");
let openApiSpec = null;
if (fs.existsSync(openApiPath)) {
  openApiSpec = JSON.parse(fs.readFileSync(openApiPath, "utf8"));
}
if (openApiSpec) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));
}

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/expenses", expenseRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;

