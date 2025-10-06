import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ICreateUserMessage,
  IUpdateUserMessage,
  IUserService,
} from '@personal/user-auth';
import { DeepPartial, In, Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { Role } from '../role/entity/role.entity';

@Injectable()
export class DBUserService implements IUserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async update(id: string, dto: IUpdateUserMessage): Promise<User> {
    if (!id && !dto.id) {
      if (dto.username) {
        dto.id = (await this.findOneByUsername(dto.username))?.id;
      } else {
        throw new UnprocessableEntityException('ID must be provided');
      }
    }
    if (id) {
      delete dto.id;
      return await this.userRepository.save({
        id,
        ...dto,
      } as DeepPartial<User>);
    } else {
      return await this.userRepository.save(dto as DeepPartial<User>);
    }
  }
  async findOneByUsernameWithPassword(username: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { username },
      relations: ['roles'],
    });
  }
  updateExternalUser(external: string, user: User, groups: string[], raw: any) {
    throw new Error('Method not implemented.');
  }
  createExternalUser(external: string, raw: any) {
    throw new Error('Method not implemented.');
  }
  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { email },
      relations: ['roles'],
    });
  }
  async findOneByUsername(username: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { username },
      relations: ['roles'],
    });
  }
  async getAllByIds(ids: string[]): Promise<User[]> {
    return await this.userRepository.find({
      where: { id: In(ids) },
      relations: ['roles'],
    });
  }
  async getById(id: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { id },
      relations: ['roles'],
    });
  }
  async getUsersByRoleIds(roleId: string[]): Promise<User[]> {
    return await this.userRepository.find({
      where: { roles: { id: In(roleId) } },
      relations: ['roles'],
    });
  }
  async getByIdWithSelect(id: string, select: string): Promise<User> {
    if (!id) throw new UnprocessableEntityException('ID must be provided');
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles'],
    });
    return user;
  }
  async getUserRoles(user: User): Promise<Role[]> {
    const u = await this.userRepository.findOne({
      where: { username: user.username },
      relations: ['roles'],
    });
    if (u?.username !== user.username) {
      throw new Error('User not found');
    }
    return u?.roles ?? [];
  }
  async create(createUserDto: ICreateUserMessage): Promise<User> {
    return await this.userRepository.save<User>(
      createUserDto as unknown as User,
    );
  }
  async findAll(): Promise<User[]> {
    return await this.userRepository.find({ relations: ['roles'] });
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
