import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AlertService, UserService } from '../services/index';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  model: any = {};
  loading = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private alertService: AlertService) { }

  ngOnInit() {
  }

  register() {
    this.loading = true;
    this.userService.create(this.model)
    .subscribe(
      data => {
        this.alertService.success('Registration successful.', true);
        this.router.navigate(['/login']);
      },
      error => {
        error = error.json();
        this.alertService.error(error.message);
        this.loading = false;
    });
  }

}
