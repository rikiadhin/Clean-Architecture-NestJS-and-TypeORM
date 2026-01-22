import { Module } from '@nestjs/common';
import { LoggerService } from '@infra/logger/logger.service';

@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
