import { randomInt } from 'crypto';

import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HasherService {
  public hash = (password: string) => bcrypt.hash(password, bcrypt.genSaltSync());

  public compare = (data: string | Buffer, encrypted: string) => bcrypt.compare(data, encrypted);

  public generateValidationCode = (min = 1000, max = 9999) => randomInt(min, max).toString();

  public generateRandomNicknameFromEmail(email: string) {
    const nameParts = email.replace(/@.+/, '');
    const name = nameParts.replace(/[&/\\#,+()$~%._@'":*?<>{}]/g, '');
    const rand = Date.now().toString(36) + randomInt(999999999).toString(36);
    return `${name}_${rand}`;
  }
}
