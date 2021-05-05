import { EntityRepository, Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './get-tasks-filter.dto';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;

    const query = this.createQueryBuilder('task'); // this is a method that interacts with the task table

    if (status){
        query.andWhere('task.status =:status', {status})
    }
    if (search) {
        query.andWhere('task.title LIKE :search OR task.description = :search', {search: `%${search}%`})
    }
    const tasks = await query.getMany();
    return tasks;
  }

  async createTask(createTaskDto: CreateTaskDto) {
    const { title, description } = createTaskDto;
    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    await task.save();
    return task;
  }
}
