import { Injectable } from '@nestjs/common';
import { IUser } from './interface/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<UserDocument>,
  ) {}

  async getUserByUsername(username: string): Promise<IUser | null> {
    return await this.userModel.findOne({ username: username });
  }

  async createUser(user: CreateUserDto): Promise<IUser> {
    const newUser = await this.userModel.create(user);
    return await newUser.save();
  }
  async getAllUsers(): Promise<IUser[]> {
    return await this.userModel.find();
  }
  async getUserById(id: string): Promise<IUser | null> {
    return await this.userModel.findById(id);
  }
  async updateUser(id: string, user: UpdateUserDto): Promise<IUser | null> {
    return await this.userModel.findByIdAndUpdate(id, user, {
      new: true,
      runValidators: true,
    });
  }
}
