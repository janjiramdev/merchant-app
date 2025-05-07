import { ECleanObjectType } from 'src/enums/utils.enum';
import { ICleanObjectInput } from 'src/interfaces/utils.interface';

export const cleanObject = <T>(args: ICleanObjectInput<T>): T => {
  const { obj, objectType } = args;

  const cleanedObj = Object.fromEntries(
    Object.entries(obj as Record<string, unknown>).filter(
      ([, value]) => value !== undefined,
    ),
  );

  if (objectType === ECleanObjectType.SEARCH) {
    const formatted: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(cleanedObj)) {
      if (!['sortBy', 'sortDirection'].includes(key))
        formatted[key] =
          typeof value === 'string' ? { $regex: value, $options: 'i' } : value;
    }
    return formatted as T;
  } else return cleanedObj as T;
};
