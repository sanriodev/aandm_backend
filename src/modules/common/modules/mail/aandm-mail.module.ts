import { MailModule } from '@ematric/common';
import { Module } from '@nestjs/common';
import { IntranetMailService } from 'src/services/intranet-mail-service/intranet-mail-service.service';
import { AppConfigModule } from './app-config.module';

@Module({
  imports: [AppConfigModule, MailModule],
  providers: [IntranetMailService],
  exports: [IntranetMailService],
})
export class AandmMailModule {}
