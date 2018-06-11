import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AlertService, AuthService } from '../services/index';


@Component({
  selector: 'app-confirm-password',
  templateUrl: './confirm-password.component.html',
  styleUrls: ['./confirm-password.component.scss']
})
export class ConfirmPasswordComponent implements OnInit {

  model: any = {};
  loading = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService) { }

  ngOnInit() {
    let token = this.route.snapshot.queryParams["token"];
    console.log('resetPasswordToken', token);
    if(token){
        this.model.token = token;
    } else {
        this.router.navigate(['/login']);
    }
  }

  confirmPassword(){
    this.loading = true;
    if(this.model.password && this.model.cpassword && this.model.password == this.model.cpassword){
      this.authService.confirmPassword(this.model.password, this.model.token)
      .subscribe(
        data => {
          this.alertService.success('Password Reset Successful', true);
          this.router.navigate(['/login']);
        },
        error => {
          error = error.json()
          this.alertService.error(error.message);
          this.loading = false;
        });
    } else {
      this.alertService.error("Passwords don't match.");
      this.loading = false;
    }
  }

}
