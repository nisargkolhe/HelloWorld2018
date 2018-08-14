import { Injectable } from '@angular/core';
import { UtilService } from './util.service';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { environment } from '../../environments';

import { User } from '../user';
import { Application } from '../application';
import { AuthService } from './auth.service';

@Injectable()
export class UserService {
	constructor(
		private http: Http,
		private utilService: UtilService,
		private authService: AuthService) { }

	getUser() {
		return this.http.get(environment.apiUrl+'/user/', this.utilService.jwt()).map((response: Response) => response.json());
 	}

	create(user: User) {
		return this.http.post(environment.apiUrl+'/user/register', user).map((response: Response) => response.json());
	}

	apply(application: Application) {
		return this.http.post(environment.apiUrl+'/user/apply', application, this.utilService.jwt()).map((response: Response) => response.json());
	}

	getApplication() {
		return this.http.get(environment.apiUrl+'/user/application', this.utilService.jwt()).map((response: Response) => response.json());
	}

	userSearch(searchKey: string) {
		return this.http.post(environment.apiUrl+'/user/search', {"searchvalue": searchKey}, this.utilService.jwt()).map((response: Response) => response.json());
	}

	loadFromLocalStorage() {
		let currentUser = new User();
		let jsonData = JSON.parse(localStorage.getItem("currentUser"));
		if(jsonData){
			currentUser.firstname = jsonData.firstname;
			currentUser.lastname = jsonData.lastname;
			currentUser.roles = jsonData.roles;
			currentUser.verified = jsonData.verified;
			return currentUser;
		} else {
			return null;
		}
	}

	public convertJsonToFormData(item){
		var formData = new FormData();

		for (var key in item) {
			if(item[key])
				formData.append(key, item[key]);
		}

		return formData;
	}

	getAnnouncements() {
		return this.http.get(environment.apiUrl+'/user/announcements', this.authService.jwt()).map((response: Response) => response.json());
	}
}
