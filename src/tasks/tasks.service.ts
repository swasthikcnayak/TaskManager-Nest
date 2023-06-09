import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './dto/tasks-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';
import { Logger } from '@nestjs/common';

@Injectable()
export class TasksService {
  private logger = new Logger('TaskController');
  constructor(
    @InjectRepository(TaskRepository) private taskRepository: TaskRepository,
  ) {}

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return await this.taskRepository.getTasks(filterDto, user);
  }

  async fetchTaskById(id: string, user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id, user } });
    if (!task) {
      this.logger.error(`Task not found for id ${id} for user with id ${user.id}`);
      throw new NotFoundException('Task with the requested Id is not found');
    }
    return task;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async deleteTaskById(id: string, user: User): Promise<Boolean> {
    const result = await this.taskRepository.delete({ id, user });
    if (result.affected == 0){
       this.logger.error(
         `Task not found for id ${id} for user with id ${user.id}`,
       );
      throw new NotFoundException(
        `The Task with requested Id ${id} is not found`,
      );
    }
    return true;
  }

  async updateTaskStatus(
    id: string,
    taskStatus: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.fetchTaskById(id, user);
    task.status = taskStatus;
    await this.taskRepository.save(task);
    return task;
  }
}
