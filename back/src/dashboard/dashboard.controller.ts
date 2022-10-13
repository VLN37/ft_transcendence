import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { DashboardService } from './dashboard.service';
import { Request as ExpressRequest } from 'express';

declare global {
  namespace Express {
    interface User {
      id: number;
    }
  }
}

@UseGuards(JwtAuthGuard)
@Controller()
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get()
  home(@Request() req: ExpressRequest) {
    return this.dashboardService.dataSummaryForUser(req.user.id);
  }
}
