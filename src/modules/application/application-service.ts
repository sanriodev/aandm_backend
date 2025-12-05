import { Injectable } from '@nestjs/common';
import { RequestAccessDto } from './dto/request-access.dto';
import { MailService } from '@personal/common';

@Injectable()
export class ApplicationService {
  constructor(private readonly mailService: MailService) {}
  async requestAccess(inputs: RequestAccessDto): Promise<boolean> {
    return true;
    //send a mail to myself (or admin email configured in .env with the request details,)

    //await this.mailService.sendMail({});
  }
}
