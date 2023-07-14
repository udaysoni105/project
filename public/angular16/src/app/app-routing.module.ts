import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { RegistrationComponent } from './auth/registration/registration.component';
import { LoginComponent } from './auth/login/login.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { ConfirmComponent } from './auth/password/confirm/confirm.component';
import { EmailComponent } from './auth/password/email/email.component';
import { ResetComponent } from './auth/password/reset/reset.component';
import { DashboardComponent } from './auth/dashboard/dashboard.component';
// import { ProjectGuard } from './core/project/project.guard';
import { ProjectCreateComponent } from './core/project/project-create/project-create.component';
import { ProjectTableComponent } from './core/project/project-table/project-table.component';
import { ProjectDetailsComponent } from './core/project/project-details/project-details.component';
import { ProjectEditComponent } from './core/project/project-edit/project-edit.component';
import { TaskEditComponent } from './core/task/task-edit/task-edit.component';
import { TaskTableComponent } from './core/task/task-table/task-table.component';
import { TaskCreateComponent } from './core/task/task-create/task-create.component';
import { UserTableComponent } from './auth/user-table/user-table.component';
import { MainComponent } from './auth/main/main.component';
import { TaskDetailsComponent } from './core/task/task-details/task-details.component';
const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  // {path:'home',component:MainComponent},
  // { path: '',loadChildren:()=>import('./auth/dashboard/dashboard.module').then(a=>a.DashboardModule),canActivate:[authGuard]},
  { path: 'dashboard', component: DashboardComponent ,canActivate:[authGuard]},
  { path: 'register', component: RegistrationComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'projects', component: ProjectTableComponent },
  { path: 'project-table', component: ProjectTableComponent },
  { path: 'confirm', component: ConfirmComponent },
  { path: 'email', component: EmailComponent },
  { path: 'reset', component: ResetComponent },
  { path: 'users', component: UserTableComponent },
  { path: 'task-edit',component:TaskEditComponent},
  { path: 'task-Create', component: TaskCreateComponent },
  { path: 'tasks', component: TaskTableComponent },
  { path: 'tasks/new', component: TaskTableComponent, canActivate: [authGuard] },
  { path: 'tasks/:id', component: TaskDetailsComponent, canActivate: [authGuard] },
  { path: 'registration', component: RegistrationComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register-project', component: ProjectCreateComponent},
    // { path: 'register-project', component: ProjectCreateComponent, canActivate: [ProjectGuard] }
  { path: 'edit-project', component: ProjectEditComponent },
  { path: 'project-details', component: ProjectDetailsComponent },
  { path: 'projects/:id', component: ProjectDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
