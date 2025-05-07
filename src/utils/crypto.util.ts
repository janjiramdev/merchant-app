import { SHA256 } from 'crypto-js';

export const hashData = (data: string): string => {
  return SHA256(data).toString();
};

export const compareData = (data: string, hashedData: string): boolean => {
  return SHA256(data).toString() === hashedData;
};
