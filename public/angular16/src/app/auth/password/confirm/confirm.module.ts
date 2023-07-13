import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { CardModule } from 'primeng/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmComponent } from './confirm.component';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
@NgModule({
  declarations: [ConfirmComponent],
  imports: [
    CommonModule,
    // CardModule,
    FormsModule,
    ReactiveFormsModule,
    PasswordModule,
    ButtonModule
  ]
})
export class ConfirmModule { }
