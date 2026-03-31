import { Request, Response } from "express";
import {
  getHealthStatus,
  getLivenessStatus,
  getReadinessStatus,
} from "./health.service";

export async function healthCheckHandler(_req: Request, res: Response) {
  const data = await getHealthStatus();
  return res.status(200).json(data);
}

export async function livenessCheckHandler(_req: Request, res: Response) {
  const data = await getLivenessStatus();
  return res.status(200).json(data);
}

export async function readinessCheckHandler(_req: Request, res: Response) {
  const data = await getReadinessStatus();
  const statusCode = data.status === "ok" ? 200 : 503;

  return res.status(statusCode).json(data);
}