import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { authGuard } from 'src/app/auth/auth.guard';
import { RouterModule, Routes } from '@angular/router';
import { TaskEditComponent } from './task-edit/task-edit.component';
import { TaskTableComponent } from './task-table/task-table.component';
import { TaskCreateComponent } from './task-create/task-create.component';
import { TaskDetailsComponent } from './task-details/task-details.component';

const routes: Routes = [
  // { path: 'edit',component:TaskEditComponent},
  // { path: 'task-Create', component: TaskCreateComponent },
  // { path: 'tasks', component: TaskTableComponent },
  // { path: 'tasks/new', component: TaskTableComponent, canActivate: [authGuard] },
  // { path: 'tasks/:id', component: TaskDetailsComponent, canActivate: [authGuard] },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes),CommonModule],
  exports: [RouterModule]
})
export class TaskRoutingModule { }
