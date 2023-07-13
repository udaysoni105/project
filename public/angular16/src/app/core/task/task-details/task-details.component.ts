import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../task.service';
@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
})
export class TaskDetailsComponent {
  Task = {id: '',
  name: '',
  description: '',
  startDate: '',
  endDate: '',
  isCompleted: '',
  projectId: ''};

}
