import { Injectable } from '@nestjs/common';

import { ProfileSoftSkillsPaginateQuery } from '@/features/profiles';
import { SoftSkillsRepository } from '@/features/soft-skills';

@Injectable()
export class ProfileSoftSkillsService {
  constructor(private readonly softSkillsRepository: SoftSkillsRepository) {}
  async getProfileSoftSkills(userId: string, query?: ProfileSoftSkillsPaginateQuery) {
    return this.softSkillsRepository.getPaginateSoftSkillsForUser(userId, query);
  }
}
