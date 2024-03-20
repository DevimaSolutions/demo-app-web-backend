import { Injectable } from '@nestjs/common';

import { SoftSkillsRepository } from './soft-skills.repository';

import { ValidationFieldsException } from '@/exceptions';
import { errorMessages } from '@/features/common';
import { CreateSoftSkillRequest } from '@/features/soft-skills/dto';

@Injectable()
export class SoftSkillsService {
  constructor(private repository: SoftSkillsRepository) {}
  findAll() {
    return this.repository.find();
  }

  getOne(id: string) {
    return this.repository.getOne(id);
  }

  async create(request: CreateSoftSkillRequest) {
    const softSkill = await this.repository.findOneBy({ name: request.name });

    if (softSkill) {
      throw new ValidationFieldsException({ email: errorMessages.softSkillExist });
    }

    return this.repository.save(request);
  }

  async update(id: string, request: CreateSoftSkillRequest) {
    const softSkill = await this.repository.getOne(id);
    const exist = await this.repository.existByName(request.name, id);

    if (exist) {
      throw new ValidationFieldsException({ email: errorMessages.softSkillExist });
    }

    await this.repository.update(softSkill.id, request);
    return await this.repository.getOne(softSkill.id);
  }

  async remove(id: string) {
    const entity = await this.repository.getOne(id);

    await this.repository.remove(entity);
  }
}
