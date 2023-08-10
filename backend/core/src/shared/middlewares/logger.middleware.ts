import { Logger } from "@nestjs/common"
import { Request, Response, NextFunction } from "express"

export function logger(req: Request, res: Response, next: NextFunction) {
  const dateStr = new Date().toISOString()
  Logger.log(`[${req.method}] ${dateStr}: ${req.path}`)
  next()
}
