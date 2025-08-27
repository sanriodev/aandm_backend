import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IRoleService } from '@personal/user-auth';
import {
  CreateRoleDto,
  UpdateRoleDto,
} from '@personal/user-auth/src/controller/v1/dto';
import { In, Repository } from 'typeorm';
import { Role } from './entity/role.entity';

@Injectable()
export class DBRolesService implements IRoleService {
  constructor(
    @InjectRepository(Role)
    private readonly rolesModel: Repository<Role>,
  ) {}

  async getById(id: string): Promise<Role> {
    return await this.rolesModel.findOne({ where: { id } });
  }

  async getAllByIds(ids: string[]): Promise<Role[]> {
    return await this.get(ids);
  }

  async getWithAllDescendantRoles(roles: string[]): Promise<Role[]> {
    const result: Role[] = [];
    await Promise.all(
      roles.map(async (r) => {
        const role = await this.getById(r.toString());
        if (role) {
          result.push(role);
        }
      }),
    );
    return result;
  }

  get(ids: string[]): Promise<Role[]> {
    return this.rolesModel.find({
      where: {
        id: In(ids),
      },
    });
  }

  getAll(): Promise<Role[]> {
    return this.rolesModel.find();
  }

  async getByName(name: string): Promise<Role> {
    return this.rolesModel.findOne({
      where: { roleName: name },
    });
  }

  async create(inputs: CreateRoleDto): Promise<Role> {
    return await this.rolesModel.create(inputs);
  }

  async update(id: string, inputs: UpdateRoleDto): Promise<Role> {
    const role = await this.rolesModel.findOne({ where: { id } });
    if (!role) throw new UnprocessableEntityException('no such role');
    return await this.rolesModel.save({ ...role, ...inputs });
  }

  async delete(id: string) {
    await this.rolesModel.delete(id);
  }
}
