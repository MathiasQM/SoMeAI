// server/utils/cors.ts
import { IncomingMessage, ServerResponse } from "http";

interface CorsOptions {
  allowedOrigins: string[];
  allowedMethods?: string[];
  allowedHeaders?: string[];
}

export function createCorsHandler(options: CorsOptions) {
  const {
    allowedOrigins,
    allowedMethods = ["GET", "POST"],
    allowedHeaders = ["Content-Type", "Authorization"],
  } = options;

  return (req: IncomingMessage, res: ServerResponse, next: () => Promise<void>) => {
    const origin = req.headers.origin as string;

    if (!origin || allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Access-Control-Allow-Methods", ["OPTIONS", ...allowedMethods].join(", "));
      res.setHeader("Access-Control-Allow-Headers", allowedHeaders.join(", "));

      if (req.method === "OPTIONS") {
        res.statusCode = 204;
        res.end();
        return;
      }

      next();
    } else {
      res.statusCode = 403;
      res.end("CORS policy not fulfilled");
    }
  };
}
