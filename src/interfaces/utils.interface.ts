import { ECleanObjectType } from 'src/enums/utils.enum';

export interface IThrowExceptionInput {
  className: string;
  methodName: string;
  err: unknown;
}

export interface ICleanObjectInput<T> {
  obj: T;
  objectType: ECleanObjectType;
}
