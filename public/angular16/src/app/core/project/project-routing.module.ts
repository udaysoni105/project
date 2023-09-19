import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { ProjectCreateComponent } from './project-create/project-create.component';
import { ProjectTableComponent } from './project-table/project-table.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { ProjectEditComponent } from './project-edit/project-edit.component';
import { ProjectDeleteComponent } from './project-delete/project-delete.component';
import { projectEditResolver } from './project-edit/project-edit.resolver';
const routes: Routes = [
  { path: 'projects', component: ProjectTableComponent },
  { path: 'register-project', component: ProjectCreateComponent },
  { path: 'project-edit/:id', component: ProjectEditComponent, resolve: { project: projectEditResolver }, },
  { path: 'project-details', component: ProjectDetailsComponent },
];
@NgModule({
  declarations: [
    ProjectCreateComponent,
    ProjectDeleteComponent,
    ProjectDetailsComponent,
    ProjectEditComponent,
    ProjectTableComponent,
  ],
  imports: [CommonModule],
})
export class ProjectRoutingModule { }
