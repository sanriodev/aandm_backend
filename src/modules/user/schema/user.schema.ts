import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IUser } from '../interface/user.interface';

@Schema()
export class User implements IUser {
  @Prop({ required: true, unique: true })
  _id: string;

  @Prop({ required: true })
  username: string;
  @Prop({ required: false })
  nickname: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false, default: [] })
  accessToken: string;

  @Prop({ required: false, default: [] })
  refreshTokens: string[];

  constructor(data) {
    Object.assign(this, data);
  }
}
export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
