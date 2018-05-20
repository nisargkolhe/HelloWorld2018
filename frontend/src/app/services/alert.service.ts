import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';


@Injectable()
export class AlertService {

  private subject = new Subject<any>();
  private keepAfterNavigationChange = false;

  constructor(private router: Router) {
    // clear alert message on route change
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.keepAfterNavigationChange) {
                // only keep for a single location change
                this.keepAfterNavigationChange = false;
              } else {
                // clear alert
                this.subject.next();
              }
            }
          });
  }

  success(message: string, keepAfterNavigationChange = false) {
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.subject.next({ type: 'success', text: message });
  }

  error(message: string, keepAfterNavigationChange = false) {
    this.keepAfterNavigationChange = keepAfterNavigationChange;

    let msg = message;

    if(message === "invalid_credentials"){
      msg = "Invalid Credentials";
    } else if(message === "unverified_email") {
      msg = "Please verify your email before submitting the application";
    } else if(message == "token_not_provided"){
      msg = "Invalid Token";
    }

    this.subject.next({ type: 'error', text: msg });
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }

}
