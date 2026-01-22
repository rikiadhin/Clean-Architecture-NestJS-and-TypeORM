import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from '@infra/entities/todo.entity';
import { User } from '@infra/entities/user.entity';
import { TypeOrmConfigModule } from '@infra/config/typeorm/typeorm.module';
import { DatabaseTodoRepository } from '@infra/repositories/todo.repository';
import { DatabaseUserRepository } from '@infra/repositories/user.repository';

@Module({
  imports: [TypeOrmConfigModule, TypeOrmModule.forFeature([Todo, User])],
  providers: [DatabaseTodoRepository, DatabaseUserRepository],
  exports: [DatabaseTodoRepository, DatabaseUserRepository],
})
export class RepositoriesModule {}
