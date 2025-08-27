import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ICreateUserMessage,
  IUpdateUserMessage,
  IUserService,
  Role,
  User,
} from '@personal/user-auth';
import { Repository } from 'typeorm';

@Injectable()
export class DBUserService implements IUserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  update(id: string, user: IUpdateUserMessage): Promise<User> {
    throw new Error('Method not implemented.');
  }
  findOneByUsernameWithPassword(username: string): User | PromiseLike<User> {
    throw new Error('Method not implemented.');
  }
  updateExternalUser(external: string, user: User, groups: string[], raw: any) {
    throw new Error('Method not implemented.');
  }
  createExternalUser(external: string, raw: any) {
    throw new Error('Method not implemented.');
  }
  findOneByEmail(email: string): Promise<User> {
    throw new Error('Method not implemented.');
  }
  findOneByUsername(username: string): Promise<User> {
    throw new Error('Method not implemented.');
  }
  getAllByIds(ids: string[]): Promise<User[]> {
    throw new Error('Method not implemented.');
  }
  getById(id: string): User | Promise<User> {
    throw new Error('Method not implemented.');
  }
  getUsersByRoleIds(roleId: string[]): Promise<User[]> | User[] {
    throw new Error('Method not implemented.');
  }
  getByIdWithSelect(id: string, select: string): Promise<User> {
    throw new Error('Method not implemented.');
  }
  getUserRoles(user: User): Promise<Role[]> {
    throw new Error('Method not implemented.');
  }
  create(createUserDto: ICreateUserMessage): Promise<User> {
    throw new Error('Method not implemented.');
  }
  findAll(): Promise<User[]> | User[] {
    throw new Error('Method not implemented.');
  }
  deleteIfDisabled(userId: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
