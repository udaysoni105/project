import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { authGuard } from './auth/auth.guard';
// import { ProjectGuard } from './core/project/project.guard';

import { RegistrationComponent } from './auth/registration/registration.component';
import { LoginComponent } from './auth/login/login.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { ConfirmComponent } from './auth/password/confirm/confirm.component';
import { EmailComponent } from './auth/password/email/email.component';
import { ResetComponent } from './auth/password/reset/reset.component';
import { DashboardComponent } from './auth/dashboard/dashboard.component';
import { ErrorComponent } from './auth/error/error.component';

import { ProjectCreateComponent } from './core/project/project-create/project-create.component';
import { ProjectTableComponent } from './core/project/project-table/project-table.component';
import { ProjectDetailsComponent } from './core/project/project-details/project-details.component';
import { ProjectEditComponent } from './core/project/project-edit/project-edit.component';
import { projectEditResolver } from './core/project/project-edit/project-edit.resolver';

import { TaskEditComponent } from './core/task/task-edit/task-edit.component';
import { TaskTableComponent } from './core/task/task-table/task-table.component';
import { TaskCreateComponent } from './core/task/task-create/task-create.component';
import { TaskDetailsComponent } from './core/task/task-details/task-details.component';
import { taskEditResolver } from './core/task/task-edit/task-edit.resolver';

import { UserTableComponent } from './auth/user-table/user-table.component';
import { MainComponent } from './auth/main/main.component';
import { ProfileComponent } from './auth/profile/profile.component';
import { ReactiveComponent } from './core/reactive/reactive/reactive.component';
const routes: Routes = [

  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'registration', component: RegistrationComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'confirm', component: ConfirmComponent },
  { path: 'email', component: EmailComponent },
  { path: 'reset', component: ResetComponent },
  { path: 'dashboard', component: DashboardComponent ,canActivate:[authGuard]},
    {path: 'home',component:MainComponent},
    // { path: '',loadChildren:()=>import('./auth/dashboard/dashboard.module').then(a=>a.DashboardModule),canActivate:[authGuard]},

  { path: 'projects', component: ProjectTableComponent },
  { path: 'register-project', component: ProjectCreateComponent},
    // { path: 'register-project', component: ProjectCreateComponent, canActivate: [ProjectGuard] }
  { path: 'project-edit/:id',component: ProjectEditComponent,resolve: {project: projectEditResolver}},
  { path: 'project-details', component: ProjectDetailsComponent },
  { path: 'soft-deleted', component: ReactiveComponent },

  { path: 'tasks', component: TaskTableComponent, canActivate: [authGuard] },
  { path: 'task-Create', component: TaskCreateComponent },
  { path: 'task-edit/:id', component: TaskEditComponent, resolve: { task: taskEditResolver } },

  { path: 'users', component: UserTableComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '**', component: ErrorComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
