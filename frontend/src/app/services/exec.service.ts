import { Injectable } from '@angular/core';
import { UtilService } from './util.service';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { environment } from '../../environments';
import { Observable } from 'rxjs/Rx';

import { User } from '../user';
import { Application } from '../application';
import { AuthService } from './auth.service';

@Injectable()
export class ExecService {

	constructor(
		private http: Http,
		private utilService: UtilService,
		private authService: AuthService) { }

	checkin(email: String) {
		return this.http.post(environment.apiUrl+'/exec/checkin', {email: email}, this.authService.jwt()).map((response: Response) => response.json());
	}

	getCheckedIn() {
		return this.http.get(environment.apiUrl+'/exec/checkin', this.authService.jwt()).map((response: Response) => response.json());
	}

	getAllApplications(){
		return this.http.get(environment.apiUrl+'/exec/applications', this.authService.jwt()).map((response: Response) => response.json());
	}

	postAnnouncement(ancm: String) {
		return this.http.post(environment.apiUrl+'/exec/announcement', {ancm: ancm}, this.authService.jwt()).map((response: Response) => response.json());
	}

	getAnnouncements() {
		return this.http.get(environment.apiUrl+'/exec/announcements', this.authService.jwt()).map((response: Response) => response.json());
	}

	downloadResume(fileName): Observable<Blob> {
		return this.http.get(environment.apiUrl+'/resumes/'+fileName, this.authService.jwtFile()).map(res => res.blob());
	}
}
