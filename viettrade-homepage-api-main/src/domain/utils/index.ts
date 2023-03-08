import { pick as _pick } from 'lodash';

import * as query from './query';
const path = require('path');

export const pick = <T extends object>(params: T, field: (keyof T)[]) => {
  return <Required<T>>_pick(params, field);
};

export const isValidEmail = (value: string) => {
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    value
  );
};

export const addBaseUrlToData = (data: any, field: string) => {
  data = JSON.parse(JSON.stringify(data));
  if (Array.isArray(data)) {
    data.map((doc) => {
      if (doc && doc[field]) {
        doc[field] = doc[field].includes('http')
          ? doc[field]
          : path.join(process.env.IMAGE_URL, doc[field]);
      }
    });
  } else {
    if (data && data[field]) {
      data[field] = data[field].includes('http')
        ? data[field]
        : path.join(process.env.IMAGE_URL, data[field]);
    }
  }
  return data;
};

export import query = query;
