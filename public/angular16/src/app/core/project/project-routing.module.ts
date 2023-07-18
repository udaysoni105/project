import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
// import { ProjectGuard } from './core/project/project.guard';
import { ProjectCreateComponent } from './project-create/project-create.component';
import { ProjectTableComponent } from './project-table/project-table.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { ProjectEditComponent } from './project-edit/project-edit.component';

const routes: Routes = [
  // { path: 'projects', component: ProjectTableComponent },
  // { path: 'project-table', component: ProjectTableComponent },
  // { path: 'register-project', component: ProjectCreateComponent},
    // { path: 'register-project', component: ProjectCreateComponent, canActivate: [ProjectGuard] }
  // { path: 'edit-project', component: ProjectEditComponent },
  // { path: 'project-details', component: ProjectDetailsComponent },
  // { path: 'projects/create', component: ProjectCreateComponent },
  // { path: 'projects/:id', component: ProjectDetailsComponent },
  // { path: 'projects/:id/edit', component: ProjectEditComponent }
  ]
@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class ProjectRoutingModule { }
