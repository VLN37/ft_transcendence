import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

type CallbackFn = (error: Error | null | undefined) => void;

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);

  constructor() {}

  use(req: Request, res: Response, next: (error?: any) => void) {
    this.logger.log('Incoming request', { request: req.body });
    next();
  }
}
