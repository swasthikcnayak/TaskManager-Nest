import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task, TaskStatus } from './tasks.model';
import {v4 as uuid} from 'uuid';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Controller('tasks')
export class TasksController {
    constructor(private taskService : TasksService){}

    @Get()
    fetchTasks(@Query() filterDto: GetTasksFilterDto): Task[]{
        if(Object.keys(filterDto).length){
            return this.taskService.fetchTaskWithFilters(filterDto);
        }else{
        return this.taskService.fetchAllTask();
        }
    }

    @Get('/:id')
    fetchTaskById(@Param('id') id : uuid) : Task{
        return this.taskService.fetchTaskById(id);
    }

    @Post()
    createTask(@Body() createTaskDto : CreateTaskDto) : Task{
        return this.taskService.createTask(createTaskDto);
    }

    @Delete('/:id')
    deleteTask(@Param('id') id:uuid){
        return this.taskService.deleteTaskById(id);
    }

    @Patch('/:id/status')
    updateTaskStatus(@Param('id') id:uuid, @Body('task_status') taskStatus : TaskStatus) : Task{
        return this.taskService.updateTaskStatus(id,taskStatus)
    }
}
