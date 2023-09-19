import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ErrorComponent } from './error.component';

@NgModule({
  declarations: [ErrorComponent],
  imports: [
    CommonModule,
    ButtonModule
  ]
})
export class ErrorModule { }
