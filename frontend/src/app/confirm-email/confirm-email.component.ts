import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, AuthService } from '../services/index';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.scss']
})
export class ConfirmEmailComponent implements OnInit {

  model: any = {};
  loading = false;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService) { }

  ngOnInit() {
    let token = this.route.snapshot.queryParams["token"];
    console.log('confirmEmailToken', token);
    if(token){
        this.model.token = token;
        this.confirmEmail();
    } else {
        this.router.navigate(['/login']);
    }
  }

  confirmEmail(){
    this.loading = true;
    this.authService.confirmEmail(this.model.token)
      .subscribe(
        data => {
          this.alertService.success('Email Verification Successful', true);
          this.router.navigate(['/login']);
        },
        error => {
            error = error.json();
            console.log(error);
            this.alertService.error(error.message);
            this.loading = false;
      });
  }
}
