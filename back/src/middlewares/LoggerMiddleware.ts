import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);

  constructor() {}

  use(req: Request, res: Response, next: (error?: any) => void) {
    const str = `Incoming request: ${req.method} ${req.path}`;
    this.logger.log(str);

    const contentLength = parseInt(req.header('Content-Length'));
    if (contentLength > 0) {
      this.logger.log({
        body: req.body,
      });
    }

    res.on('close', () => {
      if (res.statusCode >= 400) {
        const strResponse =
          `Returning response ${res.statusCode} for request ` +
          `${req.method} ${req.path}`;
        this.logger.warn(strResponse);
      }
      else if (res.statusCode >= 500) {
        const strResponse =
          `Returning response ${res.statusCode} for request ` +
          `${req.method} ${req.path}`;
        this.logger.error(strResponse);
      }
      else {
        const strResponse =
          `Returning response ${res.statusCode} for request ` +
          `${req.method} ${req.path}`;
        this.logger.log(strResponse);
      }
    });
    next();
  }
}
