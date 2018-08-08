import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, AuthService } from '../services/index';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  model: any = {};
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService) { }

  ngOnInit() {
  }

  resetPassword(){
    this.loading = true;
    this.authService.resetPassword(this.model.email)
      .subscribe(
        data => {
            if(data.message == "success"){
                this.alertService.success('Please check your email for password reset link.', true);
                this.router.navigate(['/login']);
            } else {
                this.alertService.error(data.message);
                this.loading = false;
            }
        },
        error => {
            error = error.json()
            if(error.message === "validation") {
              this.alertService.error("Please enter a valid email");
            } else {
              this.alertService.error(error.message);
            }
            this.loading = false;
        });
  }

}
