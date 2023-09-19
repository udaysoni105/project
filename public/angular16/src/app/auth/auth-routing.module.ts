import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { authGuard } from './auth.guard';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { EmailComponent } from './password/email/email.component';
import { ResetComponent } from './password/reset/reset.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainComponent } from './main/main.component';
import { UserTableComponent } from './user-table/user-table.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'registration', component: RegistrationComponent },
  { path: 'login', component: LoginComponent },
  { path: 'email', component: EmailComponent },
  { path: 'reset', component: ResetComponent },
  { path: 'dashboard', component: DashboardComponent ,canActivate:[authGuard]},
  { path: 'users', component: UserTableComponent },
  {path:'home',component:MainComponent},
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes) 
  ]
})
export class AuthRoutingModule { }