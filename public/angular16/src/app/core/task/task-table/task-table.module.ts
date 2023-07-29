import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AppComponent } from 'src/app/app.component';
import { DialogModule } from 'primeng/dialog';
import { TaskTableComponent } from './task-table.component';
import { TaskService } from '../task.service';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';

@NgModule({
  declarations: [
    AppComponent,
    TaskTableComponent
    // Other component declarations
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    DialogModule,
    DropdownModule,
    MultiSelectModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [TaskService],
  bootstrap: [AppComponent],
  exports:[
    TaskTableComponent
  ]
})
export class TaskTableModule { }
