import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtHelper } from 'angular2-jwt';

import { AuthService, UserService } from './services/index';

@Injectable()
export class AuthGuard implements CanActivate {

  jwtHelper: JwtHelper = new JwtHelper();

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let token = localStorage.getItem('token');
	  if (token && !this.jwtHelper.isTokenExpired(token)) {
      this.userService.getUser()
        .subscribe(
            result => {
              console.log('getUser res', result);

              //update jwt token
              var user = result;
              localStorage.setItem('currentUser', JSON.stringify(user));

              return true;
            }, error => {
              localStorage.removeItem('currentUser');
              localStorage.removeItem('token');
              // things went wrong so redirect to login page with the return url
              this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
              console.log(error);
              return false;
            }
        );
      return true;
  	} else {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');

    	// not logged in so redirect to login page with the return url
    	this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
    	return false;
    }
  }
}
