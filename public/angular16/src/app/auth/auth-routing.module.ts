import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { ConfirmComponent } from './password/confirm/confirm.component';
import { EmailComponent } from './password/email/email.component';
import { ResetComponent } from './password/reset/reset.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainComponent } from './main/main.component';
import { UserTableComponent } from './user-table/user-table.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [

  // { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'registration', component: RegistrationComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'confirm', component: ConfirmComponent },
  { path: 'email', component: EmailComponent },
  { path: 'reset', component: ResetComponent },
  { path: 'dashboard', component: DashboardComponent ,canActivate:[authGuard]},
  { path: 'users', component: UserTableComponent },
    {path:'home',component:MainComponent},
    // { path: '',loadChildren:()=>import('./auth/dashboard/dashboard.module').then(a=>a.DashboardModule),canActivate:[authGuard]},

]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes) 
  ]
})
export class AuthRoutingModule { }