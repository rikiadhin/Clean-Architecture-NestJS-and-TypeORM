import { TodoPresenter } from './todo.presenter';
import { AddTodoDto, UpdateTodoDto } from './todo.dto';
import { addTodoUseCases } from '@usecases/todo/addTodo.usecases';
import { UseCaseProxy } from '@infra/usecases-proxy/usecases-proxy';
import { getTodosUseCases } from '@usecases/todo/getTodos.usecases';
import { ApiExtraModels, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { updateTodoUseCases } from '@usecases/todo/updateTodo.usecases';
import { deleteTodoUseCases } from '@usecases/todo/deleteTodo.usecases';
import { ApiResponseType } from '@infra/common/swagger/response.decorator';
import { GetTodoUseCases } from '@infra/../usecases/todo/getTodo.usecases';
import { UsecasesProxyModule } from '@infra/usecases-proxy/usecases-proxy.module';
import { Body, Controller, Delete, Get, Inject, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ROUTES } from '@/infrastructure/common/constants/routes.contant';
import { TAGS } from '@/infrastructure/common/constants/api-tag.contant';
import { SUMMARY } from '@/infrastructure/common/constants/api-operation.contant';

@Controller(ROUTES.TODO)
@ApiTags(TAGS.TODO) 
@ApiExtraModels(TodoPresenter)
export class TodoController {
  constructor(
    @Inject(UsecasesProxyModule.GET_TODO_USECASES_PROXY)
    private readonly getTodoUsecaseProxy: UseCaseProxy<GetTodoUseCases>,
    @Inject(UsecasesProxyModule.GET_TODOS_USECASES_PROXY)
    private readonly getAllTodoUsecaseProxy: UseCaseProxy<getTodosUseCases>,
    @Inject(UsecasesProxyModule.PUT_TODO_USECASES_PROXY)
    private readonly updateTodoUsecaseProxy: UseCaseProxy<updateTodoUseCases>,
    @Inject(UsecasesProxyModule.DELETE_TODO_USECASES_PROXY)
    private readonly deleteTodoUsecaseProxy: UseCaseProxy<deleteTodoUseCases>,
    @Inject(UsecasesProxyModule.POST_TODO_USECASES_PROXY)
    private readonly addTodoUsecaseProxy: UseCaseProxy<addTodoUseCases>,
  ) {}

  @Get(ROUTES.TODO)
  @ApiResponseType(TodoPresenter, false)
  @ApiOperation({ summary: SUMMARY.GET_BY_ID, description : SUMMARY.GET_BY_ID })
  async getTodo(@Query('id', ParseIntPipe) id: number) {
    const todo = await this.getTodoUsecaseProxy.getInstance().execute(id);
    return new TodoPresenter(todo);
  }

  @Get(ROUTES.TODOS)
  @ApiResponseType(TodoPresenter, true)
  @ApiOperation({ summary: SUMMARY.GET_ALL, description : SUMMARY.GET_ALL })
  async getTodos() {
    const todos = await this.getAllTodoUsecaseProxy.getInstance().execute();
    return todos.map((todo) => new TodoPresenter(todo));
  }

  @Put(ROUTES.TODO)
  @ApiResponseType(TodoPresenter, true)
  @ApiOperation({ summary: SUMMARY.PUT, description : SUMMARY.PUT })
  async updateTodo(@Body() updateTodoDto: UpdateTodoDto) {
    const { id, isDone } = updateTodoDto;
    await this.updateTodoUsecaseProxy.getInstance().execute(id, isDone);
    return 'success';
  }

  @Delete(ROUTES.TODO)
  @ApiResponseType(TodoPresenter, true)
  @ApiOperation({ summary: SUMMARY.DELETE, description : SUMMARY.DELETE })
  async deleteTodo(@Query('id', ParseIntPipe) id: number) {
    await this.deleteTodoUsecaseProxy.getInstance().execute(id);
    return 'success';
  }

  @Post(ROUTES.TODO)
  @ApiResponseType(TodoPresenter, true)
  @ApiOperation({ summary: SUMMARY.POST, description : SUMMARY.POST })
  async addTodo(@Body() addTodoDto: AddTodoDto) {
    const { content } = addTodoDto;
    const todoCreated = await this.addTodoUsecaseProxy.getInstance().execute(content);
    return new TodoPresenter(todoCreated);
  }
}
