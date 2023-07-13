import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserTableComponent } from './user-table.component';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [UserTableComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  providers: [
    AuthService
  ],
  exports:[
    UserTableComponent
  ]
})
export class UserTableModule { }
