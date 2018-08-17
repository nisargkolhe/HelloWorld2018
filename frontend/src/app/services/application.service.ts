import { Injectable } from '@angular/core';
import { UtilService } from './util.service';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { environment } from '../../environments';

import { User } from '../user';
import { Application } from '../application';

@Injectable()
export class ApplicationService {

  constructor(
    private utilService: UtilService,
    private http: Http
  ) { }

  getAllApplications() {
      return this.http.get(environment.apiUrl+'/applications',  this.utilService.jwt()).map((response: Response) => response.json());
  }

  getApplicationsStatus() {
      return this.http.get(environment.apiUrl+'/applications/status',  this.utilService.jwt()).map((response: Response) => response.json());
  }

  getApplication(id) {
      return this.http.get(environment.apiUrl+'/applications/'+id,  this.utilService.jwt()).map((response: Response) => response.json());
  }

  setStatus(id, status) {
      return this.http.post(environment.apiUrl+'/applications/'+id+'/setStatus', {"status":status}, this.utilService.jwt()).map((response: Response) => response.json());
  }


}
