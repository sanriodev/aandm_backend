import { Inject, Injectable } from '@nestjs/common';
import { IRMQMailAttachment, IRMQSendMailOptions, MailService } from '@ematric/common';
import { User } from 'src/model/user/user';
import { AppConfigService } from '../app-config/app-config.service';
import { Project } from 'src/model/project/project';
import * as moment from 'moment';
import { AppConfig } from '../../model/app-config/app-config';
import { Order } from '../../model/order/order';

class MailTemplate {
  private _attachments: IRMQMailAttachment[] = [];
  private _replacements: Record<string, any> = {};
  private _optionsGetter: (date: moment.Moment, userMail: string, additionalArgs: any[]) => IRMQSendMailOptions;

  constructor(optionsGetter: (date: moment.Moment, userMail: string, additionalArgs: any[]) => IRMQSendMailOptions) {
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

  public async build(date: moment.Moment, userMail: string, additionalArgs: any[] = []): Promise<IRMQSendMailOptions> {
    const options = this._optionsGetter(date, userMail, additionalArgs);
    options.attachments = this._attachments;
    options.templateData = this._replacements;
    return options;
  }

  public static MailAttachmentFromFile(url: string, desiredFileName: string): IRMQMailAttachment {
    return {
      filename: desiredFileName,
      path: url,
    };
  }
}

@Injectable()
export class IntranetMailService {
  private appConfig: AppConfig;

  private listMonth = {
    0: 'Jänner',
    1: 'Februar',
    2: 'März',
    3: 'April',
    4: 'Mai',
    5: 'Juni',
    6: 'Juli',
    7: 'August',
    8: 'September',
    9: 'Oktober',
    10: 'Novermber',
    11: 'Dezember',
  };

  private templates = {
    newUser: new MailTemplate((_: moment.Moment, userMail: string, _additionalArgs: any[]): IRMQSendMailOptions => {
      return {
        from: this.appConfig.projectConfiguration.mailConfig.email_from,
        to: userMail,
        subject: `Willkommen im Intranet`,
        template: 'invite',
      } as IRMQSendMailOptions;
    }),
    resetPassword: new MailTemplate(
      (_: moment.Moment, userMail: string, _additionalArgs: any[]): IRMQSendMailOptions => {
        return {
          from: this.appConfig.projectConfiguration.mailConfig.email_from,
          to: userMail,
          subject: `Passwort zurückgesetzt`,
          template: 'forgotten-password',
        } as IRMQSendMailOptions;
      },
    ),
    revokeReport: new MailTemplate(
      (date: moment.Moment, userMail: string, _additionalArgs: any[]): IRMQSendMailOptions => {
        return {
          from: this.appConfig.projectConfiguration.mailConfig.email_from,
          to: userMail,
          subject: `Stundennachweis ${('0' + (date.month() + 1).toString()).slice(-2)} ${date.year()} zurückgerufen!`,
          template: 'revokeReport',
        } as IRMQSendMailOptions;
      },
    ),

    notification: new MailTemplate((_: moment.Moment, userMail: string): IRMQSendMailOptions => {
      return {
        from: this.appConfig.projectConfiguration.mailConfig.email_from,
        to: userMail,
        subject: `Notification`,
        template: 'notification',
      } as IRMQSendMailOptions;
    }),

    orderNotification: new MailTemplate((_: moment.Moment, userMail: string): IRMQSendMailOptions => {
      return {
        from: this.appConfig.projectConfiguration.mailConfig.email_from,
        to: userMail,
        subject: `Bestellung noch nicht abgeschlossen`,
        template: 'orderNotification',
      } as IRMQSendMailOptions;
    }),

    sendReport: new MailTemplate(
      (date: moment.Moment, userMail: string, _additionalArgs: any[]): IRMQSendMailOptions => {
        return {
          from: this.appConfig.projectConfiguration.mailConfig.email_from,
          to: userMail,
          subject: `Stundennachweis ${('0' + (date.month() + 1).toString()).slice(-2)} ${date.year()}`,
          template: 'sendReport',
        } as IRMQSendMailOptions;
      },
    ),
    assignedAsProjectManager: new MailTemplate(
      (_date: moment.Moment, userMail: string, additionalArgs: any[]): IRMQSendMailOptions => {
        return {
          from: this.appConfig.projectConfiguration.mailConfig.email_from,
          to: userMail,
          subject: `${additionalArgs[0]} - Zuweisung`,
          template: 'assigned-as-project-manager',
        } as IRMQSendMailOptions;
      },
    ),
    reminderMonthlyReport: new MailTemplate(
      (_: moment.Moment, userMail: string, _additionalArgs: any[]): IRMQSendMailOptions => {
        return {
          from: this.appConfig.projectConfiguration.mailConfig.email_from,
          to: userMail,
          subject: `Stundenabschluss`,
          template: 'reminderMonthlyReport',
        } as IRMQSendMailOptions;
      },
    ),
    insidentCreated: new MailTemplate(
      (_: moment.Moment, userMail: string, _additionalArgs: any[]): IRMQSendMailOptions => {
        return {
          from: this.appConfig.projectConfiguration.mailConfig.email_from,
          to: userMail,
          subject: `Neuer Vorfall`,
          template: 'insidentCreated',
        } as IRMQSendMailOptions;
      },
    ),
  };

  constructor(
    private readonly appConfigService: AppConfigService,
    @Inject(MailService) private readonly mailService: MailService,
  ) {
    this.appConfig = appConfigService.getAppConfig();
  }

  private getMailForUser(user: User): string {
    // make sure that we don't send real emails on dev
    if (this.appConfigService.getAppConfig().app === 'dev') {
      return user.username + '@notaEmail.com';
    } else {
      return user.email;
    }
  }

  public async sendReport(user: User, pathToPDF: string, fileName: string, date: moment.Moment) {
    const mailTemplate = this.templates.sendReport;

    const mailMeta: IRMQSendMailOptions = await mailTemplate
      .setAttachments([
        MailTemplate.MailAttachmentFromFile(
          `monthly-report/pdfInternal?month=${date.month() + 1}&year=${date.year()}&user=${user.id}`,
          fileName,
        ),
      ])
      .setReplacements({
        name: user.firstName,
      })
      .build(date, this.getMailForUser(user));

    await this.mailService.sendMail(mailMeta);
  }

  public async sendRevokeReport(user: User, date: moment.Moment) {
    const mailTemplate = this.templates.revokeReport;

    const mailMeta: IRMQSendMailOptions = await mailTemplate
      .setReplacements({
        name: user.firstName,
      })
      .build(date, this.getMailForUser(user));

    await this.mailService.sendMail(mailMeta);
  }

  public async sendResetPassword(user: User, password: string) {
    const mailTemplate = this.templates.resetPassword;

    const mailMeta: IRMQSendMailOptions = await mailTemplate
      .setReplacements({
        name: user.firstName,
        password,
      })
      .build(null, this.getMailForUser(user));

    await this.mailService.sendMail(mailMeta);
  }

  public async sendNewUser(user: User, password: string) {
    const mailTemplate = this.templates.newUser;

    const mailMeta: IRMQSendMailOptions = await mailTemplate
      .setReplacements({
        name: user.firstName,
        username: user.username,
        password,
      })
      .build(null, this.getMailForUser(user));

    await this.mailService.sendMail(mailMeta);
  }

  public async sendProjectManagerMail(user: User, project: Project) {
    const mailTemplate = this.templates.assignedAsProjectManager;

    const mailMeta: IRMQSendMailOptions = await mailTemplate
      .setReplacements({
        name: user.firstName,
        project,
      })
      .build(null, this.getMailForUser(user), [project.name]);

    await this.mailService.sendMail(mailMeta);
  }

  public async sendReminderMonthlyReport(user: User) {
    let lastMonth = new Date().getMonth() - 1;
    if (lastMonth == -1) {
      lastMonth = 11;
    }
    const mailTemplate = this.templates.reminderMonthlyReport;

    const mailMeta: IRMQSendMailOptions = await mailTemplate
      .setReplacements({
        name: user.firstName,
        month: this.listMonth[lastMonth],
      })
      .build(null, this.getMailForUser(user));

    await this.mailService.sendMail(mailMeta);
  }

  public async sendNotificationEmail(user: User, message: string, title: string) {
    const mailTemplate = this.templates.notification;
    const mailMeta: IRMQSendMailOptions = await mailTemplate
      .setReplacements({
        name: user.firstName,
        mess: message,
        tit: title,
      })
      .build(null, this.getMailForUser(user));

    await this.mailService.sendMail(mailMeta);
  }

  public async sendOrderNotificationEmail(order: Order) {
    const mailTemplate = this.templates.orderNotification;
    const mailMeta: IRMQSendMailOptions = await mailTemplate
      .setReplacements({
        name: order.User.firstName,
        date: moment(order.createdAt).format('DD.MM.YYYY'),
        orderNr: order.orderNumber,
        project: order.Project.name,
        projectId: order.ProjectId,
        orderId: order.id,
      })
      .build(null, this.getMailForUser(order.User));

    await this.mailService.sendMail(mailMeta);
  }

  public async sendInsidentCreationEmail(
    user: User,
    message: {
      assosiation: string;
      insidentTitle: string;
      insidentDescription: string;
      insidentUser: string;
      ressourceName: string;
    },
  ) {
    const mailTemplate = this.templates.insidentCreated;
    const mailMeta: IRMQSendMailOptions = await mailTemplate
      .setReplacements({
        name: user.firstName,
        message: message,
      })
      .build(null, this.getMailForUser(user));
    await this.mailService.sendMail(mailMeta);
  }

  public async sendAliasLoginEmail(userToSendTo: User, userNameFromRequest: string) {
    const message = 'Der Benutzer ' + userNameFromRequest + ' hat sich als Alias auf ihrem Intranet Konto angemeldet.';
    const mailTemplate = this.templates.notification;
    const mailMeta: IRMQSendMailOptions = await mailTemplate
      .setReplacements({
        name: userToSendTo.firstName,
        mess: message,
        tit: 'Alias Anmeldung',
      })
      .build(null, this.getMailForUser(userToSendTo));

    await this.mailService.sendMail(mailMeta);
  }

  public async sendAnniversaryNotification(
    roleIds: string[],
    birthdays: { firstName: string; lastName: string; daysFromNowText: string; formattedDate: string; age: number }[],
    employeeAnniversaries: {
      firstName: string;
      lastName: string;
      daysFromNowText: string;
      formattedDate: string;
      age: number;
    }[],
  ) {
    const mailMeta: IRMQSendMailOptions = {
      from: this.appConfig.projectConfiguration.mailConfig.email_from,
      to: { roleIds },
      subject: 'Anstehende Jubiläen',
      template: 'anniversaryNotification',
      templateData: {
        birthdays: birthdays,
        employeeAnniversaries: employeeAnniversaries,
      },
    } as any as IRMQSendMailOptions;

    await this.mailService.sendMail(mailMeta);
  }
}
