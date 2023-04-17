import { EntityRepository, Repository } from "typeorm";
import { Task } from "./task.entity";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskStatus } from "./tasks-status.enum";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { stat } from "fs";

export class TaskRepository extends Repository<Task>{

    async getTasks(filterDto : GetTasksFilterDto): Promise<Task[]> {
        const {status,search} = filterDto;
        const query = this.createQueryBuilder('task');
        if(status){
            query.andWhere('task.status = :status', {status});
        }
        if(search){
            query.andWhere('LOWER(task.title) LIKE :search OR LOWER(task.description) LIKE :search', {search : `%${search.toLowerCase()}%`});
        }
        const tasks = await query.getMany();
        return tasks;
    }

    async createTask(createTask : CreateTaskDto): Promise<Task> {
        const {title, description} = createTask;
        const task = this.create({
            title, description, status : TaskStatus.OPEN
        });
        await this.save(task);
        return task;
    }
}