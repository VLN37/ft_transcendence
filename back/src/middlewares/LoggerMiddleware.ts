import { faker } from '@faker-js/faker';
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
      const strResponse =
        `Returning response ${res.statusCode} for request ` +
        `${req.method} ${req.path}`;
      this.logger.log(strResponse);
    });
    next();
  }
}

export function editFileName(req, file: Express.Multer.File, callback) {
  //FIXME: error does not reach front end api

  // console.log(file.filename);
  const name = faker.random.alphaNumeric(20);
  const fileExt = file.originalname.split('.').pop();
  const filename = name + '.' + fileExt;
  console.log(filename);
  callback(null, filename);
}
