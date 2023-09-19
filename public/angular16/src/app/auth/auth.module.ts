import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppComponent } from 'src/app/app.component';
import { RegistrationComponent } from './registration/registration.component';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';
import { UserTableComponent } from './user-table/user-table.component';

import { EmailComponent } from './password/email/email.component';
import { ResetComponent } from './password/reset/reset.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthService } from './auth.service'

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { TabMenuModule } from 'primeng/tabmenu';
import { FieldsetModule } from 'primeng/fieldset';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { PasswordModule } from 'primeng/password';
import { DropdownModule } from 'primeng/dropdown';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from '../app-routing.module';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProfileComponent } from './profile/profile.component';
import { ErrorComponent } from './error/error.component';
import { MatSelectModule } from '@angular/material/select';
import { ErrorModule } from './error/error.module';
import { Error401Component } from './error401/error401.component';
@NgModule({
  declarations: [
    AppComponent,
    EmailComponent,
    ResetComponent,
    DashboardComponent,
    UserTableComponent,
    RegistrationComponent,
    MainComponent,
    LoginComponent,
    ProfileComponent,
    ErrorComponent,
    Error401Component
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CarouselModule,
    ButtonModule,
    ErrorModule,
    TabMenuModule,
    FieldsetModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MessageModule,
    ToastModule,
    FormGroup,
    FormBuilder,
    Validators,
    DropdownModule,
    HttpClientModule,
    TableModule,
    AppRoutingModule,
    InputTextModule,
    CardModule,
    InputTextareaModule,
    CalendarModule,
    PasswordModule,
    RouterModule,
    MatSelectModule
  ],
  providers: [AuthService],
  exports: [

    EmailComponent,
    ResetComponent,
    DashboardComponent,
    UserTableComponent,
    RegistrationComponent,
    MainComponent,
    LoginComponent,
    AppComponent
  ],
  bootstrap: [AppComponent]
})
export class AuthModule { }
