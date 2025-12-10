import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { RequestAccessDto } from './dto/request-access.dto';
import { AandMMailService } from '../common/modules/mail/aandm-mail.service';
import { DBUserService } from '../user/user.service';

@Injectable()
export class ApplicationService {
  constructor(
    private readonly mailService: AandMMailService,
    private readonly userService: DBUserService,
  ) {}
  async requestAccess(inputs: RequestAccessDto): Promise<void> {
    const found1 = await this.userService.findOneByEmail(inputs.email);
    const found2 = await this.userService.findOneByUsername(inputs.username);
    if (found1 || found2) {
      throw new UnprocessableEntityException('Cannot request access');
    }

    //send a mail to myself (or admin email configured in .env with the request details,)

    return await this.mailService.sendRequestAccessEmail(inputs);
  }
}
