import { hash } from 'bcrypt';

export const hashData = async (data: string): Promise<string> => {
  return await hash(data, 10);
};
