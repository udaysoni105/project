import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './dashboard.component';
// Import PrimeNG modules
import { ButtonModule } from 'primeng/button';
// Add other PrimeNG modules as needed
import { CarouselModule } from 'primeng/carousel';
import { AppComponent } from 'src/app/app.component';
import { TabMenuModule } from 'primeng/tabmenu';
import { FieldsetModule } from 'primeng/fieldset';
@NgModule({
  declarations: [
    AppComponent,DashboardComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    CarouselModule,
    // Add imported PrimeNG modules to the 'imports' array
    ButtonModule,
    TabMenuModule,
    FieldsetModule
    // Add other PrimeNG modules as needed
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [DashboardComponent]
})
export class DashboardModule { }
