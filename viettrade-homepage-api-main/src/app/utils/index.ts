import { includes, isEmpty, pick as _pick, pickBy } from 'lodash';
import { extname } from 'path';

export const pick = <T extends object>(params: T, field: (keyof T)[]) => {
  return <T>_pick(params, field);
};

/**
 * same as pick function but exclude undefined and empty string
 * @param params search parameter
 * @param fields field to pick
 */
export const pickForSearch = <T extends object>(
  params: T,
  fields: (keyof T)[]
) => {
  return <T>(
    pickBy(
      params,
      (value, key) => includes(fields, <keyof T>key) && !isEmpty(value)
    )
  );
};

export const emptyStringToNull = (value: any) =>
  value === undefined || (typeof value === 'string' && value.length) === 0
    ? null
    : value;

export const checkNumberOnly = (value: string) => !/^[0-9]*$/.test(value);

export const editFileName = (req: any, file: any, callback: any) => {
  const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
  const random = ('' + Math.random()).substring(2, 8);
  const random_number = timestamp + random;

  // const name = file.originalname;
  // const subName = name.substr(name.lastIndexOf('.'));
  // const newName = name.replace(subName, '');
  const fileExtName = extname(file.originalname);
  // const randomName = Array(4)
  //   .fill(null)
  //   .map(() => Math.round(Math.random() * 16).toString(16))
  //   .join('');
  callback(null, `${random_number}${fileExtName}`, req);
};
