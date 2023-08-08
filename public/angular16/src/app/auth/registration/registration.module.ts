import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { MatSelectModule } from '@angular/material/select';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ButtonModule,
    FormsModule,
    // FormGroup,
    // FormBuilder,
    // Validators,
    ReactiveFormsModule,
    DropdownModule,
    MatSelectModule
  ]
})
export class RegistrationModule { }
