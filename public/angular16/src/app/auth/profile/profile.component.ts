import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

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
  imageUploaded = false;
  selectedFile: File | null = null;
  selectedFileName: string | null = null;
  payload: any;
  files: any;
  constructor(private http: HttpClient, private authService: AuthService, private router: Router) { }

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
      email: 'email',
    });

    if (jwtToken) {
      this.authService.getUserProfile(jwtToken).subscribe(
        (response) => {
          const user = response as User; // Cast the response to the User type
          // console.log(user);
          this.user = user;
          this.userId = user.id;
          this.loading = false;
        },
        (error) => {
          console.error('Error fetching user profile:', error);
        }
      );
    }
  }

  // onFileSelected(event: any) {
  //   console.log(event.target.files);
  //   this.selectedFile = event.target.files[0];
  // }

  // uploadImage() {
  //   if (!this.selectedFile) {
  //     console.error('No image file selected.');
  //     return;
  //   }

  //   const jwtToken = localStorage.getItem('token');
  //   const email = localStorage.getItem('email');

  //   if (!jwtToken) {
  //     console.error('JWT token not found in local storage. Please log in.');
  //     return;
  //   }

  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${jwtToken}`,
  //     email: `${email}`,
  //   });

  //   const formData = new FormData();
  //   formData.append('image', this.selectedFile);

  //   this.imageUploaded = true;
  //   console.log('Form Data:', formData);

  //   this.authService.createimage(formData, headers).subscribe(
  //     (response: any) => {
  //       console.log("API Response:", response);
  //       if (response.base64_image) {
  //         // Assuming the Laravel API returns the base64 representation of the uploaded image
  //         this.user.image = 'data:image/png;base64,' + response.base64_image;
  //         console.log('this.user.image:', this.user.image);
  //       } else {
  //         console.error('No base64 image data found in the response.');
  //       }
  //     },
  //     (error) => {
  //       console.error('Error uploading image:', error);
  //     }
  //   );
  // }


  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.files = event.target.files[0].name;
    console.log(this.files);
  }

  uploadImage() {
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
    console.log(headers);

    // Read the selected file as a data URL (base64)
    const reader = new FileReader();
    // console.log(reader);
    reader.onload = (event: any) => {
      console.log(event);
      if (event.target) { // Check if event.target is not null

        var binaryString = event.target.result;
        console.log(this.files);
        // const image = this.selectedFile;

        // Create a JSON payload with the base64 image
        this.payload = {
          base64Image: btoa(binaryString), // Rename the property to 'base64Image'
          filename: this.files,
        };
        console.log(this.payload);

        this.imageUploaded = true;
        // console.log('Base64 Image:', base64Image);

        this.authService.createimage(this.payload, headers).subscribe(
          (response: any) => {
            console.log("API Response:", response);
            console.log("yes");
            // Assuming the API returns the URL of the uploaded image
            // this.user.image = response.imageURL; // Update this line with the actual image URL
            this.user.image = 'https://s3-us-west-1.amazonaws.com/snapstics-staging-file-storage/images/user_logo/';
            // console.log('this.user.image:', this.user.image);
          },
          (error) => {
            console.log("no");
            console.error('Error uploading image:', error);
          }
        );
      }
    };

    // Read the selected file as a data URL (base64)
    reader.readAsDataURL(this.selectedFile);
  }


  updateProfile() {
    this.imageUploaded = false;
  }

  deleteProfile(): void {
    console.log('Delete profile function called');
    const userId: number = this.userId as number;

    if (confirm('Are you sure you want to delete your profile?')) {
      console.log('Confirmed to delete');
      this.authService.deleteUserProfile(userId)
        .subscribe(
          (response) => {
            console.log('Profile deleted successfully', response);
          },
          (error) => {
            console.error('Error deleting profile:', error);
            console.log('Profile deletion failed');
          }
        );
    }
  }
}
