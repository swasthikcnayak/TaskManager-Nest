import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
    private tasks : Task[] = [];

    public fetchAllTask(): Task[]{
        return this.tasks;
    }

    public fetchTaskWithFilters(filterDto : GetTasksFilterDto): Task[] {
        const { status, search} = filterDto;
        var taskCopy = this.fetchAllTask();
        
        if(status){
            taskCopy = taskCopy.filter((task)=> task.status === status);
            return taskCopy;
        }
        if(search){
            taskCopy = taskCopy.filter((task)=>task.title.includes(search) || task.description.includes(search));
        }
        return taskCopy;
    }

    public fetchTaskById(id : uuid) : Task{
        const task = this.tasks.find((task)=>{
            return task.id === id;
        });
        if(!task){
            throw new NotFoundException("Task with the requested Id is not found");
        }
        return task;
    }


    public createTask(createTaskDto : CreateTaskDto): Task{
        const {title,description} = createTaskDto;
        const task : Task = {
            id : uuid(),
            title,
            description,
            status : TaskStatus.OPEN,
        }
        this.tasks.push(task);
        return task;
    }
    
    public deleteTaskById(id: uuid): boolean {
        this.fetchTaskById(id);
        this.tasks = this.tasks.filter((task)=> task.id !== id);
        return true;
    }

    public updateTaskStatus(id: uuid, taskStatus: TaskStatus){
        this.tasks.map((task)=>{
            if(task.id == id){
                task.status = taskStatus;
            }
        });
        return this.fetchTaskById(id);
    }
}
