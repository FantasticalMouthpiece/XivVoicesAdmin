import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";

export type ApiHandler = (
  req: NextApiRequest,
  res: NextApiResponse,
  session?: Session,
) => Promise<void> | void;

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export type MethodHandlers = Partial<Record<HttpMethod, ApiHandler>>;
