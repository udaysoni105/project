import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AppComponent } from 'src/app/app.component';
import { DialogModule } from 'primeng/dialog';
import { TaskTableComponent } from './task-table.component';
import { TaskService } from '../task.service';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    TaskTableComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    DialogModule,
    DropdownModule,
    MultiSelectModule,
    MatFormFieldModule, 
    MatSelectModule, 
    NgFor, 
    MatInputModule, 
    FormsModule
  ],
  providers: [TaskService],
  bootstrap: [AppComponent],
  exports:[
    TaskTableComponent
  ]
})
export class TaskTableModule { }
