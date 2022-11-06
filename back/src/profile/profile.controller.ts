import { Body, Controller, Logger, Post, Req } from "@nestjs/common";
import { ProfileService } from "./profile.service";

@Controller('profile')
export class ProfileController {
  private readonly logger = new Logger(ProfileController.name);

  constructor(private ProfileService: ProfileService) {}

  @Post('/avatar')
  uploadAvatar(@Req() req: any, @Body() body: any, @Body('avatar') content: string) {
    // console.log('req', req);
    console.log('body ->', body);
    console.log('content', content);
    this.logger.log('Incoming avatar upload request');
    this.ProfileService.saveAvatar(content);
    return 'ta la';
  }
}
