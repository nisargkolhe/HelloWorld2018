import { Injectable } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';

@Injectable()
export class UtilService {

  constructor() { }

  public jwt() {
    // create authorization header with jwt token
    //let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let token = localStorage.getItem('token');
    if (token) {
    	let headers = new Headers({ 'Authorization': 'Bearer ' + token });
    	return new RequestOptions({ headers: headers });
    }
  }
}
