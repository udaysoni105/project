import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TaskService } from '../task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.scss'],
})
export class TaskCreateComponent implements OnInit {
  taskForm!: FormGroup;
  projects: SelectItem[] = [];
  users: SelectItem[] = [];
  projectOptions: SelectItem[] = [];
  loading: boolean = false;
  selectedProjectStartDate: Date | string | undefined;
  selectedProjectEndDate: Date | string | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.taskForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      project_id: ['', Validators.required],
      user_id: [[], Validators.required]
    });
    this.route.data.subscribe((data: any) => {
      if (data['taskAndUsers']) {
        const { taskDetails, users } = data['taskAndUsers'];
        this.taskForm.patchValue(taskDetails);
        this.users = users.map((user: any) => ({
          label: user.name,
          value: user.id
        }));
        this.loading = false;
      }
    });

    // Add a listener for changes in the end_date field
    this.taskForm.get('end_date')?.valueChanges.subscribe((endDate) => {
      const startDate = this.taskForm.get('start_date')?.value;

      // Check if end_date is smaller than start_date
      if (endDate < startDate) {
        // Clear the start_date field
        this.taskForm.get('start_date')?.setValue('');
      }
    });
    this.fetchProject();
    this.fetchUser();
  }

  /** 
* @author : UDAY SONI
* Method name: onProjectSelect
* Fetch project details based on the selectedProjectId using your data source or API call
*/
  onProjectSelect(event: any): void {
    const selectedProjectId = event.value;
    this.taskService.getProjectById(selectedProjectId).subscribe(
      (selectedProject) => {
        if (selectedProject) {
          this.selectedProjectStartDate = selectedProject.start_date;
          this.selectedProjectEndDate = selectedProject.end_date;
        } else {
          this.selectedProjectStartDate = selectedProject.start_date;
          this.selectedProjectEndDate = selectedProject.end_date;
        }
        // Reset the start_date and end_date form controls
        this.taskForm.get('start_date')?.reset();
        this.taskForm.get('end_date')?.reset();
      },
      (error) => {
        // Handle error
      }
    );
  }


  /** 
* @author : UDAY SONI
* Method name: fetchProject
*/
  fetchProject(): void {
    this.taskService.getProject().subscribe({
      next:(projects) => {
        if (projects !== null && projects !== undefined) {
          this.projectOptions = projects.map((project) => ({
            label: project.name,
            value: project.id,
          }));
        }
        else {
          this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'project not found' });
          setTimeout(() => {
          }, 1500);
        }
      },
      error:(error) => {
        this.loading = false;

        if (error.status === 404) {
          this.router.navigate(['/404']);
        } else if (error.status === 401) {
          this.router.navigate(['/401']);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to fetch projects',
          });
          this.router.navigate(['/401']);
        }
      },
      complete() {
        console.log("is completed");
      },}
    );
  }

  /** 
* @author : UDAY SONI
* Method name: fetchUser
* Adjust this based on your actual user data structure
*/
  fetchUser(): void {
    this.taskService.getUser().subscribe(
      (users) => {
        if (users !== null && users !== undefined) {
          this.users = users.map((user: any) => ({
            label: user.name,
            value: user.id,
          }));
        }
        else {
          this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'user not found' });
          setTimeout(() => {
          }, 1500);
        }
      },
      (error) => {
        this.loading = false;

        if (error.status === 404) {
          this.router.navigate(['/404']);
        } else if (error.status === 401) {
          this.router.navigate(['/401']);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to softDelete project',
          });
          this.router.navigate(['Not Found']);
        }
      }
    );
  }

  /** 
* @author : UDAY SONI
* Method name: createtask
* Stop loading when the data is fetched
*/
  createtask(): void {
    this.loading = true;

    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');

    if (token !== null && email !== null) {
      const task = this.taskForm.value;

      this.taskService.createTask(task, token, email).subscribe(
        (response) => {
          if (response !== null && response !== "") {
            this.taskForm.reset();
            this.loading = false;
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Task is created' });
            setTimeout(() => {
              this.router.navigate(['/tasks']);
            }, 1500);
          }
          else {
            this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'task create unsuccessfully' });
            setTimeout(() => {
            }, 1500);
          }
        },
        (error) => {
          console.error('Failed to create task', error);
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create task',
          });
        }
      );
    } else {
      this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'task not create' });
      setTimeout(() => {
      }, 1500);
    }
  }

  /** 
* @author : UDAY SONI
* Method name: cancel
* You can add logic here to navigate to a different page or reset the form
* Navigate to another page
* Or reset the form, if needed
*/
  cancel() {
    this.router.navigate(['/tasks']);
    this.taskForm.reset();
  }
}
