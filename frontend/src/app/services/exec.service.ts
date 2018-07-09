import { Injectable } from '@angular/core';
import { UtilService } from './util.service';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { environment } from '../../environments';

import { User } from '../user';
import { Application } from '../application';

@Injectable()
export class ExecService {

	constructor(
		private http: Http,
		private utilService: UtilService) { }

	checkin(email: String) {
		return this.http.post(environment.apiUrl+'/exec/checkin', email).map((response: Response) => response.json());
	}
}