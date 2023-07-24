import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { authGuard } from 'src/app/auth/auth.guard';
import { RouterModule, Routes } from '@angular/router';
import { TaskEditComponent } from './task-edit/task-edit.component';
import { TaskTableComponent } from './task-table/task-table.component';
import { TaskCreateComponent } from './task-create/task-create.component';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { TaskDeleteComponent } from './task-delete/task-delete.component';
import { taskEditResolver } from './task-edit/task-edit.resolver';

const routes: Routes = [
  // { path: 'tasks/:id', component: TaskDetailsComponent, canActivate: [authGuard] },
  { path: 'tasks', component: TaskTableComponent },
  // { path: 'tasks', component: TaskTableComponent, canActivate: [authGuard] },
  { path: 'task-Create', component: TaskCreateComponent },
  { path: 'task-edit/:id', component: TaskEditComponent, resolve: { task: taskEditResolver } },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes),CommonModule],
  exports: [RouterModule]
})
export class TaskRoutingModule { }
