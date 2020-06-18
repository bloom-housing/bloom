import { Logger } from "@nestjs/common"
import { Request, Response } from "express"

export function logger(req: Request, res: Response, next: Function) {
  const dateStr = new Date().toISOString()
  Logger.log(`[${req.method}] ${dateStr}: ${req.path}`)
  next()
}
