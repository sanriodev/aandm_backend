import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  Repository,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class BaseDatabaseService<
  T extends { id: number },
  CreateT extends DeepPartial<T>,
  UpdateT extends DeepPartial<T>,
> {
  constructor(protected readonly repository: Repository<T>) {}

  async findOne(id: number, relations: string[] = []) {
    const options: FindOneOptions<T> = {
      where: { id: id as any },
    };
    if (relations.length > 0) options.relations = relations;
    return await this.repository.findOne(options);
  }

  async findMany(findOptions: FindManyOptions<T>): Promise<T[]> {
    return await this.repository.find(findOptions);
  }

  async create(data: CreateT) {
    delete data.id;
    const insertRes = await this.repository.insert(
      data as QueryDeepPartialEntity<T>,
    );
    return await this.repository.findOne({
      where: { id: insertRes.identifiers[0].id },
    });
  }

  async createOrUpdate(data: CreateT) {
    const existing = await this.repository.findOne({
      where: {
        id: data.id as any,
      },
    });

    if (existing) {
      return await this.update({ ...existing, ...data } as any);
    } else {
      return await this.create(data);
    }
  }

  async update(data: UpdateT) {
    await this.repository.save(data);
    return await this.findOne(data.id);
  }

  async delete(id: number) {
    const current = await this.findOne(id);
    await this.repository.delete(current.id);
    return current;
  }
}
