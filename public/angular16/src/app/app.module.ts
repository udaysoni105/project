import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { AuthService } from './auth/auth.service';
import { AppRoutingModule } from './app-routing.module';
// import { RegistrationModule } from './auth/registration/registration.module';
import { ProjectService } from './core/project/project.service';
import { RegistrationComponent } from './auth/registration/registration.component';
// Import PrimeNG modules

import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { ProjectCreateComponent } from './core/project/project-create/project-create.component';
import { ProjectDeleteComponent } from './core/project/project-delete/project-delete.component';
import { ProjectDetailsComponent } from './core/project/project-details/project-details.component';
import { ProjectEditComponent } from './core/project/project-edit/project-edit.component';
import { ProjectTableComponent } from './core/project/project-table/project-table.component';
import { TaskCreateComponent } from './core/task/task-create/task-create.component';
import { TaskDeleteComponent } from './core/task/task-delete/task-delete.component';
import { TaskDetailsComponent } from './core/task/task-details/task-details.component';
import { TaskEditComponent } from './core/task/task-edit/task-edit.component';
import { TaskTableComponent } from './core/task/task-table/task-table.component';
import { ConfirmComponent } from './auth/password/confirm/confirm.component';
import { EmailComponent } from './auth/password/email/email.component';
import { ResetComponent } from './auth/password/reset/reset.component';
import { DashboardComponent } from './auth/dashboard/dashboard.component';
import { CarouselModule } from 'primeng/carousel';
import { UserTableComponent } from './auth/user-table/user-table.component';
import { MainComponent } from './auth/main/main.component';

import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { FieldsetModule } from 'primeng/fieldset';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { TaskService } from './core/task/task.service';
import { TabMenuModule } from 'primeng/tabmenu';
import { MessageService } from 'primeng/api';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogModule } from 'primeng/dialog';
import { ProfileComponent } from './auth/profile/profile.component';
import { DatePipe, NgFor } from '@angular/common';
import { UserchecktableComponent } from './core/userchecktablee/userchecktable/userchecktable.component';
import { ReactiveComponent } from './core/reactive/reactive/reactive.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { ProgressBarModule } from 'primeng/progressbar';

const routes: Routes = [
  { path: 'register', component: RegistrationComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    LoginComponent,
    LogoutComponent,
    ProjectCreateComponent,
    ProjectDeleteComponent,
    ProjectDetailsComponent,
    ProjectEditComponent,
    ProjectTableComponent,
    TaskCreateComponent,
    TaskDeleteComponent,
    TaskDetailsComponent,
    TaskEditComponent,
    TaskTableComponent,
    ConfirmComponent,
    EmailComponent,
    ResetComponent,
    DashboardComponent,
    UserTableComponent,
    MainComponent,
    ProfileComponent,
    UserchecktableComponent,
    ReactiveComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    CarouselModule,
    TableModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    DialogModule,
    RouterModule.forRoot(routes),
    // Add PrimeNG modules to the imports
    ButtonModule,
    InputTextModule,
    CardModule,
    InputTextareaModule,
    CalendarModule,
    MessageModule,
    ToastModule,
    DropdownModule,
    TabMenuModule,
    FieldsetModule,
    MultiSelectModule,
    MatFormFieldModule, 
    MatSelectModule, 
    NgFor, 
    MatInputModule,
    ProgressBarModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [AuthService, ProjectService, TaskService,MessageService,DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
