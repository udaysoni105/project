import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
export interface User {
  id: number;
}
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: any;
  loading: boolean = false;
  userId!: number;
  image_filename = false;
  selectedFile: File | null = null;
  selectedFileName: string | null = null;
  payload: any;
  files: any;
  oldprofileimage: string = '';

  constructor(private http: HttpClient,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router) {
      this.user = {
        image_filename: false,
      };
  }

  ngOnInit(): void {
    this.loading = true;
    const jwtToken = localStorage.getItem('token');
    const email = localStorage.getItem('email');

    if (!jwtToken) {
      console.error('JWT token not found in local storage. Please log in.');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${jwtToken}`,
      'email': `${email}`,
    });

    if (jwtToken) {
      this.authService.getUserProfile(headers).subscribe(
        (response) => {
          if (response !== null && response !== "") {
            const user = response as User;
            this.user = user;
            this.userId = user.id;
            this.loading = false;
            // Check if the user has uploaded an image (user.image_filename will be truthy)
            if (this.user && this.user.image_filename) {
              // User has uploaded an image, no need to show the upload button
              this.user.image_filename = true;
            } else {
              // User has not uploaded an image, show the upload button
              this.user.image_filename = false;
            }
          } else {
            this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'unsuccessfully' });
            setTimeout(() => {
            }, 1500);
          }
        },
        (error) => {
          this.loading = false;
        }
      );
    }
  }

  /** 
* @author : UDAY SONI
* Method name: onFileSelected
*/
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.files = event.target.files[0].name;
  }

  /** 
* @author : UDAY SONI
* Method name: uploadImage
* Read the selected file as a data URL (base64)
* Check if event.target is not null
* Create a JSON payload with the base64 image
* Rename the property to 'base64Image'
* Assuming the API returns the URL of the uploaded image
* Update this line with the actual image URL
* Read the selected file as a data URL (base64)
*
*/
  uploadImage() {
    this.loading = true;
    if (!this.selectedFile) {
      console.error('No image file selected.');
      return;
    }

    const jwtToken = localStorage.getItem('token');
    const email = localStorage.getItem('email');

    if (!jwtToken) {
      console.error('JWT token not found in local storage. Please log in.');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${jwtToken}`,
      email: `${email}`,
    });

    const reader = new FileReader();

    reader.onload = (event: any) => {

      if (event.target) {

        var binaryString = event.target.result;

        // const image = this.selectedFile;
        this.payload = {
          base64Image: btoa(binaryString),
          filename: this.files,
        };

        this.user.image_filename = true;

        this.authService.createimage(this.payload, headers).subscribe(
          (response: any) => {
            if (response !== null && response !== "") {
              this.loading = false;
              window.location.reload()
              if (this.payload !== null && this.payload !== "") {
                // this.user.image = response.imageURL; 
                this.user.image = 'https://s3-us-west-1.amazonaws.com/snapstics-staging-file-storage/images/user_logo/';
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'profile image sent successfully' });
                setTimeout(() => {
                }, 1500);
              }
              else {
                this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'image not upload' });
                setTimeout(() => {
                }, 1500);
              }
            } else {
              this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'unsuccessfully' });
              setTimeout(() => {
              }, 1500);
            }
          },
          (error) => {
            this.loading = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'profile image not sent'
            });
            setTimeout(() => {
            }, 1500);
          }
        );
      }
    };
    reader.readAsDataURL(this.selectedFile);
  }

  /** 
* @author : UDAY SONI
* Method name: updateProfile
*/
  updateProfile() {
    this.user.image_filename = false;
  }

  /** 
* @author : UDAY SONI
* Method name: deleteProfile
*/
  deleteProfile() {
    this.user.image_filename = true;
    if (!this.user) {
      console.error('No user selected.');
      return;
    }

    const jwtToken = localStorage.getItem('token');
    const email = localStorage.getItem('email');

    if (!jwtToken) {
      console.error('JWT token not found in local storage. Please log in.');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${jwtToken}`,
      email: `${email}`,
    });

    const deleteProfilePic = {
      // profilepic: this.user.image,
      user_id: this.user.id,
      oldprofilepic: this.user.image_filename,
    };


    this.authService.deleteUserProfile(this.user.id, deleteProfilePic, headers).subscribe(
      (response) => {
        if (response !== null && response !== "") {
          this.user.image = '';
          window.location.reload()
          this.user.image_filename = false;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Profile image deleted successfully' });
        } else {
          this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'unsuccessfully' });
          setTimeout(() => {
          }, 1500);
        }
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete profile image'
        });
      }
    );
  }
}
