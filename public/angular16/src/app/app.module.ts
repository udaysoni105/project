import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
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
import { EmailComponent } from './auth/password/email/email.component';
import { ResetComponent } from './auth/password/reset/reset.component';
import { DashboardComponent } from './auth/dashboard/dashboard.component';
import { CarouselModule } from 'primeng/carousel';
import { UserTableComponent } from './auth/user-table/user-table.component';
import { MainComponent } from './auth/main/main.component';
import { MatPaginatorModule } from '@angular/material/paginator';
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
import { ReactiveComponent } from './core/project/reactive/reactive.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { ProgressBarModule } from 'primeng/progressbar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { JsonPipe } from './pipename.pipe';
import { PaginatorModule } from 'primeng/paginator';
import { ErrorModule } from './auth/error/error.module';
import { Error401Module } from './auth/error401/error401.module';
import { ErrorHandler, Injectable, Injector } from '@angular/core';

@Injectable()
export class CustomErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    console.error('Custom Error Handler:', error);
  }
}
@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    LoginComponent,
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
    EmailComponent,
    ResetComponent,
    DashboardComponent,
    UserTableComponent,
    MainComponent,
    ProfileComponent,
    UserchecktableComponent,
    ReactiveComponent,
    JsonPipe
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
    ButtonModule,
    Error401Module,
    InputTextModule,
    ErrorModule,
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
    ProgressBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    AutoCompleteModule,
    PaginatorModule,
    MatPaginatorModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [AuthService, ProjectService, TaskService, MessageService, DatePipe, ErrorHandler, CustomErrorHandler],
  bootstrap: [AppComponent],
})
export class AppModule { }
