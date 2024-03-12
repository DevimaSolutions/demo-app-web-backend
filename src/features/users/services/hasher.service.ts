import { randomInt } from 'crypto';

import * as bcrypt from 'bcrypt';

export class HasherService {
  public hash = (password: string) => bcrypt.hash(password, bcrypt.genSaltSync());

  public compare = (data: string | Buffer, encrypted: string) => bcrypt.compare(data, encrypted);

  public generateValidationCode = (min = 1000, max = 9999) => randomInt(min, max).toString();
}
