import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from './services/index';

@Component({
	moduleId: module.id,
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
	show: boolean;
	public isLoggedIn: boolean;

	constructor(
		private userService: UserService
		) {
		this.show = true;
	}
	title = 'Hello World';
	ngOnInit() {
    if(this.userService.loadFromLocalStorage()){
      //User is logged in
      this.isLoggedIn = true;
    } else {
      //User is not logged in
      this.isLoggedIn = false;
    }
  }
}
