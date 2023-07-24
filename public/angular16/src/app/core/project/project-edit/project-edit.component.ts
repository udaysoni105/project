import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../project.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.scss']
})
export class ProjectEditComponent implements OnInit {
  projectForm!: FormGroup;
  projectId!: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.projectForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      status: ['', Validators.required]
    });

    this.route.params.subscribe(params => {
      this.projectId = params['id'];
      this.loadProjectDetails();
    });
  }

  loadProjectDetails(): void {
    this.projectService.getProjectById(this.projectId).subscribe(
      response => {
        this.projectForm.patchValue(response);
      },
      error => {
        console.error('Failed to retrieve project details', error);
      }
    );
  }

  saveChanges(): void {
    if (this.projectForm.valid) {
      const projectData = this.projectForm.value;
      this.projectService.updateProject(this.projectId, projectData).subscribe(
        response => {
          console.log('Project updated successfully', response);
          this.router.navigate(['/projects']);
        },
        error => {
          console.error('Failed to update project', error);
        }
      );

  console.log('Project ID:', this.projectId); // Add this line
    } else {
      console.error('Invalid form data');
    }
  }
}
// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { ActivatedRoute } from '@angular/router';
// import { ProjectService } from '../project.service';
// import { Router } from '@angular/router';
// import { HttpClient, HttpHeaders } from '@angular/common/http';

// @Component({
//   selector: 'app-project-edit',
//   templateUrl: './project-edit.component.html',
//   styleUrls: ['./project-edit.component.scss']
// })
// export class ProjectEditComponent implements OnInit {
//   projectForm!: FormGroup;
//   projectId!: string;
//   projects: any[] = [];

//   constructor(
//     private formBuilder: FormBuilder,
//     private route: ActivatedRoute,
//     private projectService: ProjectService,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.projectForm = this.formBuilder.group({
//       name: ['', Validators.required],
//       description: [''],
//       start_date: ['', Validators.required],
//       end_date: ['', Validators.required],
//       status: ['', Validators.required]
//     });

//     this.route.params.subscribe((params) => {
//       this.projectId = params['id'];z
//       this.loadProjectDetails();
//     });
//   }

//   loadProjectDetails(): void {
//     const jwtToken = localStorage.getItem('token');
//     const email = localStorage.getItem('email');

//     if (!jwtToken) {
//       console.error('JWT token not found in local storage. Please log in.');
//       return;
//     }

//     const headers = new HttpHeaders({
//       Authorization: `Bearer ${jwtToken}`,
//       projectId: this.projectId,
//       Permission: 'update_project' // Add the Permission header with the desired value
//     });

//     // Make the API call with the headers and project ID
//     this.projectService.getProjectById(this.projectId, null, jwtToken, email || '').subscribe(
//       (response) => {
//         // Handle the response here
//         console.log(response);
//         this.projects = response; 
//         this.projectForm.patchValue(response); // Update the form with the project data
//       },
//       (error) => {
//         // Handle the error here
//         console.error(error);
//       }
//     );
//   }

//   saveChanges(): void {
//     if (this.projectForm.valid) {
//       const projectData = this.projectForm.value;
//       const jwtToken = localStorage.getItem('token');
//       const email = localStorage.getItem('email');
  
//       if (!jwtToken) {
//         console.error('JWT token not found in local storage. Please log in.');
//         return;
//       }
  
//       this.projectService.updateProject(this.projectId, projectData, jwtToken, email || '').subscribe(
//         (response) => {
//           console.log('Project updated successfully', response);
//           this.router.navigate(['/projects']);
//         },
//         (error) => {
//           console.error('Failed to update project', error);
//         }
//       );
//     } else {
//       console.error('Invalid form data');
//     }
//   }
  
// }
