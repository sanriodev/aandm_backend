import { Inject, Injectable } from '@nestjs/common';
import {
  AppConfigService,
  IRMQMailAttachment,
  IRMQSendMailOptions,
  MailService,
} from '@personal/common';
import { User } from '../../../user/entity/user.entity';
import { EmailConfigService } from '../../../../config/email/config.service';
import { RequestAccessDto } from '../../../application/dto/request-access.dto';

class MailTemplate {
  private _attachments: IRMQMailAttachment[] = [];
  private _replacements: Record<string, any> = {};
  private _optionsGetter: (
    userMail: string,
    additionalArgs: any[],
  ) => IRMQSendMailOptions;

  constructor(
    optionsGetter: (
      userMail: string,
      additionalArgs: any[],
    ) => IRMQSendMailOptions,
  ) {
    this._optionsGetter = optionsGetter;
  }

  public setAttachments(attachments: [IRMQMailAttachment]): MailTemplate {
    this._attachments = attachments;
    return this;
  }

  public setReplacements(replacements: Record<string, any>): MailTemplate {
    this._replacements = replacements;
    return this;
  }

  public async build(
    userMail: string,
    additionalArgs: any[] = [],
  ): Promise<IRMQSendMailOptions> {
    const options = this._optionsGetter(userMail, additionalArgs);
    options.attachments = this._attachments;
    options.templateData = this._replacements;
    return options;
  }

  public static MailAttachmentFromFile(
    url: string,
    desiredFileName: string,
  ): IRMQMailAttachment {
    return {
      filename: desiredFileName,
      path: url,
    };
  }
}

@Injectable()
export class AandMMailService {
  private templates = {
    // newUser: new MailTemplate(
    //   (
    //     userMail: string,
    //     _additionalArgs: any[],
    //   ): IRMQSendMailOptions => {
    //     return {
    //       from: this.appConfig.projectConfiguration.mailConfig.email_from,
    //       to: userMail,
    //       subject: `Willkommen im Intranet`,
    //       template: 'invite',
    //     } as IRMQSendMailOptions;
    //   },
    // ),
    // resetPassword: new MailTemplate(
    //   (
    //     userMail: string,
    //     _additionalArgs: any[],
    //   ): IRMQSendMailOptions => {
    //     return {
    //       from: this.appConfig.projectConfiguration.mailConfig.email_from,
    //       to: userMail,
    //       subject: `Passwort zurückgesetzt`,
    //       template: 'forgotten-password',
    //     } as IRMQSendMailOptions;
    //   },
    // ),
    requestAccess: new MailTemplate((): IRMQSendMailOptions => {
      return {
        from: this.emailConfigService.LoadedConfig.emailFrom,
        to: this.emailConfigService.LoadedConfig.adminEmail,
        subject: `Requesting Access`,
        template: 'request-access',
      } as IRMQSendMailOptions;
    }),
  };

  constructor(
    private readonly appConfigService: AppConfigService,
    @Inject(MailService) private readonly mailService: MailService,
    private readonly emailConfigService: EmailConfigService,
  ) {}

  private getMailForUser(user: User): string {
    // make sure that we don't send real emails on dev
    if (this.appConfigService.env !== 'production') {
      return user.username + '@notaEmail.com';
    } else {
      return user.email;
    }
  }

  // public async sendResetPassword(user: User, password: string) {
  //   const mailTemplate = this.templates.resetPassword;

  //   const mailMeta: IRMQSendMailOptions = await mailTemplate
  //     .setReplacements({
  //       name: user.firstName,
  //       password,
  //     })
  //     .build(this.getMailForUser(user));

  //   await this.mailService.sendMail(mailMeta);
  // }

  // public async sendNewUser(user: User, password: string) {
  //   const mailTemplate = this.templates.newUser;

  //   const mailMeta: IRMQSendMailOptions = await mailTemplate
  //     .setReplacements({
  //       name: user.firstName,
  //       username: user.username,
  //       password,
  //     })
  //     .build(this.getMailForUser(user));

  //   await this.mailService.sendMail(mailMeta);
  // }

  public async sendRequestAccessEmail(inputs: RequestAccessDto) {
    const mailTemplate = this.templates.requestAccess;
    const mailMeta: IRMQSendMailOptions = await mailTemplate
      .setReplacements({
        username: inputs.username,
        email: inputs.email,
      })
      .build(this.emailConfigService.LoadedConfig.adminEmail);

    await this.mailService.sendMail(mailMeta);
  }
}
