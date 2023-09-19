import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Error401Component } from './error401.component';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [Error401Component],
  imports: [
    CommonModule,
    ButtonModule
  ]
})
export class Error401Module { }
