import { IsEnum, IsOptional } from 'class-validator';
import { TaskStatus } from './tasks-status.enum';
import { Repository } from 'typeorm';

export class GetTasksFilterDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  search?: string;
}
