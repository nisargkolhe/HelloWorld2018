import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { JwtHelper } from 'angular2-jwt';
import 'rxjs/add/operator/map';
import { environment } from '../../environments';

@Injectable()
export class AuthService {

	jwtHelper: JwtHelper = new JwtHelper();

	constructor(private http: Http) { }

	login(email: string, password: string) {
		console.log("email", email);
		console.log("password", password);
    //let headers = new Headers({ 'Content-Type': 'application/json' });
    //let options = new RequestOptions({ headers: headers });
    return this.http.post(environment.apiUrl+'/user/login', {"email": email, "password": password })
    .map((response: Response) => {
      // login successful if there's a jwt token in the response
      console.log("RESPONSE",response);
      let user = response.json();
      if (user && user.token) {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(this.jwtHelper.decodeToken(user.token)));
        localStorage.setItem('token', user.token);
        console.log("token decoded", this.jwtHelper.decodeToken(user.token));
      }
    });
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
		localStorage.removeItem('token');
  }

  resetPassword(email: string) {
  	return this.http.post(environment.apiUrl+'/user/resetPassword', {"email": email})
  	.map((response: Response) => response.json());
  }

  confirmPassword(password: string, token: string) {
  	return this.http.post(environment.apiUrl+'/user/confirmPassword', {"password": password, "token": token})
  	.map((response: Response) => response.json());
  }

  resendVerificationEmail() {
  	return this.http.post(environment.apiUrl+'/user/resendVerificationEmail', {}, this.jwt()).map((response: Response) => response.json());
  }

  confirmEmail(token: string) {
  	return this.http.post(environment.apiUrl+'/user/verify', {"token": token})
  	.map((response: Response) => response.json());
  }

  jwt() {
    // create authorization header with jwt token
    //let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let token = localStorage.getItem('token');
    if (token) {
    	let headers = new Headers({ 'Authorization': 'Bearer ' + token });
    	return new RequestOptions({ headers: headers });
    } else {
    	return null;
    }
  }
}
