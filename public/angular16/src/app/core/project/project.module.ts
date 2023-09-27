import { NgModule, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppComponent } from 'src/app/app.component';
import { ProjectCreateComponent } from './project-create/project-create.component';
import { ProjectDeleteComponent } from './project-delete/project-delete.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { ProjectEditComponent } from './project-edit/project-edit.component';
import { ProjectTableComponent } from './project-table/project-table.component';
import { ProjectService } from './project.service';

import { BrowserModule } from '@angular/platform-browser';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { HttpClientModule } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule } from 'primeng/menu';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ErrorModule } from 'src/app/auth/error/error.module';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  declarations: [
    ProjectCreateComponent,
    ProjectDeleteComponent,
    ProjectDetailsComponent,
    ProjectEditComponent,
    ProjectTableComponent,
    AppComponent,
  ],
  imports: [
    CommonModule,
    CalendarModule,
    CardModule,
    HttpClientModule,
    TableModule,
    PaginatorModule,
    ButtonModule,
    BrowserAnimationsModule,
    SplitButtonModule,
    ToastModule,
    DropdownModule,
    ErrorModule,
    MenuModule,
    FormsModule,
    ViewChild,
    ConfirmDialogModule,
    InputTextModule,
    ReactiveFormsModule,
    RouterModule,
    BrowserModule,
    MessageService,
    MatPaginatorModule
  ],
  providers: [ProjectService],
  exports: [
    ProjectCreateComponent,
    ProjectDeleteComponent,
    ProjectDetailsComponent,
    ProjectEditComponent,
    ProjectTableComponent,
    AppComponent,
  ],
})
export class ProjectModule { }
