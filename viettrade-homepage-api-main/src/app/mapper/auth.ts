import { Request } from 'express';

import { types } from '../../common';
import { pick } from '../utils';

export const contactFormData = (req: Request) => {
  return pick(<types.auth.ContactInfo>req.body, [
    'fullName',
    'phone',
    'email',
    'title',
    'content'
  ]);
};
