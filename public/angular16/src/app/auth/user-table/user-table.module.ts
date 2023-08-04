import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserTableComponent } from './user-table.component';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { ProgressBarModule } from 'primeng/progressbar';


@NgModule({
  declarations: [UserTableComponent, ], // Include JsonPipe here
  imports: [
    CommonModule,
    FormsModule,
    ProgressBarModule
  ],
  providers: [
    AuthService
  ],
  exports:[
    UserTableComponent
  ]
})
export class UserTableModule { }
