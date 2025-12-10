import { Module } from '@nestjs/common';
import { AppConfigModule, MailModule } from '@personal/common';
import { AandMMailService } from './aandm-mail.service';
import { EmailConfigModule } from '../../../../config/email/config.module';

@Module({
  imports: [EmailConfigModule, AppConfigModule, MailModule],
  providers: [AandMMailService],
  exports: [AandMMailService],
})
export class AandmMailModule {}
