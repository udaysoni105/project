import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { TableModule } from 'primeng/table'; // Import the TableModule from PrimeNG

import { AppComponent } from 'src/app/app.component';
import { ProfileComponent } from './profile.component';

@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    TableModule // Add the TableModule to imports
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class ProfileModule { }
