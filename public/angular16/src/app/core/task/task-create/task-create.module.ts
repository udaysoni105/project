import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DropdownModule,
    MatSelectModule,
    MatDatepickerModule,
    AutoCompleteModule,
    CalendarModule
  ]
})
export class TaskCreateModule { }
