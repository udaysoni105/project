import { NgModule } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';


import { TaskEditComponent } from './task-edit/task-edit.component';
import { TaskTableComponent } from './task-table/task-table.component';
import { TaskCreateComponent } from './task-create/task-create.component';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { TaskDeleteComponent } from './task-delete/task-delete.component';
import { TaskService } from './task.service';

import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { AppComponent } from 'src/app/app.component';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ProgressBarModule } from 'primeng/progressbar';

@NgModule({
  declarations: [
    TaskCreateComponent,
    TaskDeleteComponent,
    TaskDetailsComponent,
    TaskEditComponent,
    TaskTableComponent,
    AppComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    CalendarModule,
    CheckboxModule,
    InputTextModule,
    InputTextareaModule,
    ButtonModule,
    HttpClientModule,
    AppRoutingModule,
    DialogModule,
    TableModule,
    CardModule,
    DropdownModule,
    MultiSelectModule,
    MatFormFieldModule,
    MatSelectModule,
    NgFor,
    MatInputModule,
    MatDatepickerModule,
    ProgressBarModule
  ],
  providers: [TaskService],
  exports: [
    TaskCreateComponent,
    TaskDeleteComponent,
    TaskDetailsComponent,
    TaskEditComponent,
    TaskTableComponent
  ],
  bootstrap: [AppComponent],
})
export class TaskModule { }
