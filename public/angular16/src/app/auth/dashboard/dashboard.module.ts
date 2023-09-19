import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './dashboard.component';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { AppComponent } from 'src/app/app.component';
import { TabMenuModule } from 'primeng/tabmenu';
import { FieldsetModule } from 'primeng/fieldset';
@NgModule({
  declarations: [
    AppComponent, DashboardComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    CarouselModule,
    ButtonModule,
    TabMenuModule,
    FieldsetModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [DashboardComponent]
})
export class DashboardModule { }
