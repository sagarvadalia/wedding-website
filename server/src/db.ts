import mongoose from "mongoose";
import dotenv from "dotenv";
import { loggers } from "./utils/logger.js";

const log = loggers.db;

export const initDb = async () => {
  // Load environment variables
  dotenv.config();

  // Pull secrets - support both individual vars and full URI
  const { MONGO_USERNAME, MONGO_PASSWORD, MONGO_CLUSTER, MONGODB_URI } = process.env;

  let uri: string;
  let clusterName: string;

  // Prefer individual credentials (more secure) over full URI
  if (MONGO_USERNAME && MONGO_PASSWORD && MONGO_CLUSTER) {
    uri = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_CLUSTER}`;
    clusterName = MONGO_CLUSTER;
  } else if (MONGODB_URI) {
    // Fallback to full URI for local development
    uri = MONGODB_URI;
    clusterName = "local";
  } else {
    throw new Error(
      "MongoDB credentials not found. Set MONGO_USERNAME, MONGO_PASSWORD, MONGO_CLUSTER or MONGODB_URI"
    );
  }

  const startTime = Date.now();
  try {
    await mongoose.connect(uri);
    const latencyMs = Date.now() - startTime;
    log.info({ latencyMs, cluster: clusterName }, "Successfully connected to MongoDB");
    mongoose.set("debug", false);
  } catch (error) {
    const latencyMs = Date.now() - startTime;
    log.error(
      { err: error, latencyMs, cluster: clusterName },
      "Failed to connect to MongoDB"
    );
    throw error;
  }
};

// Handling connection events
mongoose.connection.on("error", (err: Error) => {
  log.error({ err }, "MongoDB connection error");
});

mongoose.connection.on("disconnected", () => {
  log.warn("MongoDB disconnected");
});

// Graceful shutdown
process.on("SIGINT", () => {
  mongoose.connection
    .close()
    .then(() => {
      log.info("MongoDB connection closed through app termination");
      process.exit(0);
    })
    .catch((err: Error) => {
      log.error({ err }, "Error closing MongoDB connection");
      process.exit(1);
    });
});

process.on("SIGTERM", () => {
  mongoose.connection
    .close()
    .then(() => {
      log.info("MongoDB connection closed through SIGTERM");
      process.exit(0);
    })
    .catch((err: Error) => {
      log.error({ err }, "Error closing MongoDB connection on SIGTERM");
      process.exit(1);
    });
});
