import { Component } from '@angular/core';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent {
  project = {
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    status:'',
  };
}
