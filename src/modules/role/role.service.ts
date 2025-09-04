import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IRoleService, UpdateRoleMessage } from '@personal/user-auth';
import { CreateRoleDto } from '@personal/user-auth/src/controller/v1/dto';
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

  async update(id: string, dto: UpdateRoleMessage): Promise<Role> {
    const entity = await this.getById(id);
    delete dto.id;
    for (const k in dto) {
      if (dto[k] !== undefined) {
        (entity as any)[k] = dto[k];
      }
    }
    return await this.rolesModel.save(entity);
  }

  async delete(id: string) {
    await this.rolesModel.delete(id);
  }
}
