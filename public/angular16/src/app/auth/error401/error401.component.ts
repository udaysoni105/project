import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error401',
  templateUrl: './error401.component.html',
  styleUrls: ['./error401.component.scss']
})
export class Error401Component {

  constructor(private router: Router) { }

  cancel() {
    this.router.navigate(['/dashboard']);
  }
}
