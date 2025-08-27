import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ICreateUserMessage,
  IUpdateUserMessage,
  IUserService,
  Role,
  User,
} from '@personal/user-auth';
import { In, Repository } from 'typeorm';

@Injectable()
export class DBUserService implements IUserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async update(id: string, user: IUpdateUserMessage): Promise<User> {
    return await this.userRepository.save({ id, ...user });
  }
  async findOneByUsernameWithPassword(username: string): Promise<User> {
    return await this.userRepository.findOne({ where: { username } });
  }
  updateExternalUser(external: string, user: User, groups: string[], raw: any) {
    throw new Error('Method not implemented.');
  }
  createExternalUser(external: string, raw: any) {
    throw new Error('Method not implemented.');
  }
  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email } });
  }
  async findOneByUsername(username: string): Promise<User> {
    return await this.userRepository.findOne({ where: { username } });
  }
  async getAllByIds(ids: string[]): Promise<User[]> {
    return await this.userRepository.find({ where: { id: In(ids) } });
  }
  async getById(id: string): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }
  async getUsersByRoleIds(roleId: string[]): Promise<User[]> {
    return await this.userRepository.find({
      where: { roles: { id: In(roleId) } },
    });
  }
  getByIdWithSelect(id: string, select: string): Promise<User> {
    return this.userRepository.findOne({
      where: { id },
      select: select.split(',').map((field) => field.trim() as keyof User),
    });
  }
  async getUserRoles(user: User): Promise<Role[]> {
    const u = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['roles'],
    });
    return u?.roles ?? [];
  }
  async create(createUserDto: ICreateUserMessage): Promise<User> {
    return await this.userRepository.save(createUserDto);
  }
  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }
  async deleteIfDisabled(userId: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (user && user.status === 'inactive') {
      await this.userRepository.delete(user.id);
      return true;
    }
    return false;
  }
}
