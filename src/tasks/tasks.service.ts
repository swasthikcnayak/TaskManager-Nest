import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './tasks-status.enum';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
@Injectable()
export class TasksService {
    constructor(@InjectRepository(TaskRepository) private taskRepository: TaskRepository, ){}

    async getTasks(filterDto : GetTasksFilterDto): Promise<Task[]> {
       return await this.taskRepository.getTasks(filterDto);
    }

    async fetchTaskById(id : uuid) : Promise<Task> {
       const task = await this.taskRepository.findOne(id);
        if(!task){
            throw new NotFoundException("Task with the requested Id is not found");
        }
        return task;
    }


    async createTask(createTaskDto : CreateTaskDto): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto);
    }
    
    async deleteTaskById(id: uuid): Promise<Boolean> {
        const result = await this.taskRepository.delete(id);
        if(result.affected == 0)
            throw new NotFoundException(`The Task with requested Id ${id} is not found`);
        return true;
    }

    async updateTaskStatus(id: uuid, taskStatus: TaskStatus) : Promise<Task> {
        const task = await this.fetchTaskById(id);
        task.status = taskStatus;
        await this.taskRepository.save(task);
        return task;
    }
}
