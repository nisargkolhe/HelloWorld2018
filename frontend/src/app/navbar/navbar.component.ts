import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  inputs: ['showButton']
})
export class NavbarComponent implements OnInit {

  showButton: boolean = false;

  constructor() { }

  ngOnInit() {
  }

}
