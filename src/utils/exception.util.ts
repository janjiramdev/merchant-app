import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { IThrowExceptionInput } from 'src/interfaces/utils.interface';

export const throwException = (args: IThrowExceptionInput) => {
  const { className, methodName, err } = args;
  const logger = new Logger(className);

  if (err instanceof BadRequestException) {
    logger.error(`${methodName} error: ${err.message}`);
    throw new BadRequestException(err.message);
  } else if (err instanceof NotFoundException) {
    logger.error(`${methodName} error: ${err.message}`);
    throw new NotFoundException(err.message);
  } else if (err instanceof ForbiddenException) {
    logger.error(`${methodName} error: ${err.message}`);
    throw new ForbiddenException(err.message);
  } else if (err instanceof Error) {
    logger.error(`${methodName} error: ${err.message}`);
    throw new InternalServerErrorException(err.message);
  } else {
    logger.error(`${methodName} error: ${JSON.stringify(err)}`);
    throw new InternalServerErrorException(JSON.stringify(err));
  }
};
