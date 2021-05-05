import { Get, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v1 as uuid } from 'uuid';
import { CreateTaskDto } from './create-task.dto';
import { GetTasksFilterDto } from './get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  async getTasks(filterDto: GetTasksFilterDto){
    return this.taskRepository.getTasks(filterDto);
  }
  async getTaskById(id: number): Promise<Task> {
    const found = await this.taskRepository.findOne(id);

    if (!found) {
      throw new NotFoundException('Task with ID not found');
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto) {
    return this.taskRepository.createTask(createTaskDto);
  }

  async deleteTaskById(id: number) {
    const deletedRecord = await this.taskRepository.delete(id);
    if (deletedRecord.affected == 0) {
      throw new NotFoundException('Task with ID not found');
    }
    return deletedRecord;
  }

  async updateTaskStatus(id: number, status: TaskStatus):Promise<Task>{
    const task = await this.getTaskById(id);
    task.status = status;
    await task.save();
    return task
  }

  // private tasks: Task[] = [];

  // getAllTasks(): Task[] {
  //   return this.tasks;
  // }

  // getTasksWithFilters(filterDto: GetTasksFilterDto){
  //   const {status, search} = filterDto
  //   let tasks = this.getAllTasks()

  //   if (status){
  //     tasks.filter(task=> task.status ===status)
  //   }

  //   if (search){
  //     tasks.filter(task=> (task.title.includes(search)) || task.description.includes(search))
  //   }

  //   return tasks
  // }

  // createTask(createTaskDto: CreateClassDto) {
  //   const { title, description } = createTaskDto;
  //   const task: Task = {
  //     title,
  //     description,
  //     status: TaskStatus.OPEN,
  //     id: uuid(),
  //   };
  //   this.tasks.push(task);
  //   return task;
  // }

  // getTaskById(id: string){
  //   const found= this.tasks.find(task=> task.id == id)

  //   if (!found){
  //     throw new NotFoundException(`Task with id: ${id} was not found`)
  //   }
  //   return found
  // }

  // deleteTaskById(id:string){
  //     this.tasks = this.tasks.filter(task=> task.id !==id)
  //     return this.tasks
  // }

  // updateTask(id:string, status:TaskStatus){
  //   console.log(id)
  //     const task = this.getTaskById(id)
  //     task.status = status
  //     return task
  // }
}
