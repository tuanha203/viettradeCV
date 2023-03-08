import * as crypto from 'crypto';
import { QueryInterface } from 'sequelize';

function hashPassword(password: string) {
  const randomSalt = Math.random()
    .toString(36)
    .substring(2)
    .substring(0, 10);
  const hashedPassword = crypto
    .createHmac('sha256', randomSalt)
    .update(password)
    .digest('hex');

  return {
    salt: randomSalt,
    password: hashedPassword
  };
}

export default {
  up: async (qi: QueryInterface) => {
    await qi.bulkDelete('admin', {}, {});
    await qi.bulkInsert(
      'admin',
      [
        {
          ...hashPassword('12345678'),
          role: 0,
          name: 'Admin',
          email: 'admin@gmail.com',
          status: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  }
};
