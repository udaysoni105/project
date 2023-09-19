import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { Component, ViewChild } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { ProjectTableComponent } from './project-table.component';
import { ProjectService } from '../project.service';
import { ProgressBarModule } from 'primeng/progressbar';
@NgModule({
  declarations: [
    ProjectTableComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    TableModule,
    PaginatorModule,
    ButtonModule,
    BrowserAnimationsModule,
    SplitButtonModule,
    ToastModule,
    DropdownModule,
    MenuModule,
    FormsModule,
    Component,
    ViewChild,
    ConfirmationService,
    ConfirmDialogModule,
    InputTextModule,
    CalendarModule,
    ProgressBarModule,
  ],
  providers: [ProjectService],
  exports: [ButtonModule, ProjectTableComponent],
})
export class ProjectTableModule { }
