import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, FormControl } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation'
import { CreateNewAutocompleteGroup, SelectedAutocompleteItem, NgAutocompleteComponent } from "ng-auto-complete";

import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

import { User } from '../user';
import { Application } from '../application';

declare var UIkit: any;

import { AlertService, UserService } from '../services/index';
@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent implements OnInit {

  //for autocomplete
  @ViewChild(NgAutocompleteComponent) public completer: NgAutocompleteComponent;

  public majorsAutocomplete = [
      CreateNewAutocompleteGroup(
          'Eg. Computer Sience',
          'completer',
          Application.getMajors(),
          {titleKey: 'title', childrenKey: null}
      ),
  ];


  majorCtrl: FormControl;

  currentUser: User;

  model: any = {};
  loading = false;
  appSubmitted = false;

  filename = null;

  class_years = [
    {value: 'freshman', viewValue: 'Freshman'},
    {value: 'sophomore', viewValue: 'Sophomore'},
    {value: 'junior', viewValue: 'Junior'},
    {value: 'senior', viewValue: 'Senior'}
  ];

  grad_years = ["2018","2019","2020","2021","2022","2023","2024","2025"];

  referrals = [
    {value: 'social_media', viewValue: 'Social Media'},
    {value: 'website', viewValue: 'Purdue Hackers Website'},
    {value: 'flyers', viewValue: 'Flyers'},
    {value: 'class', viewValue: 'Class Callout'},
    {value: 'friend', viewValue: 'Friend'}
  ];

  shirt_sizes = [
    {value: 's', viewValue: 'S'},
    {value: 'm', viewValue: 'M'},
    {value: 'l', viewValue: 'L'},
    {value: 'xl', viewValue: 'XL'},
    {value: 'xxl', viewValue: 'XXL'}
  ];

  constructor(
    private router: Router,
    private userService: UserService,
    private alertService: AlertService) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      this.majorCtrl = new FormControl();
      this.model.firstName = this.currentUser.firstname;
      this.model.lastName = this.currentUser.lastname;
      this.model.email = this.currentUser.email;
  }

  ngOnInit() {
    this.loadApplication();
  }

  setFile(event){
    console.log('upload', event.target.files);
    this.model.resume = event.target.files[0];
    this.filename = event.target.files[0].name;
  }

  onDrop(event, data: any) {
    //let dataTransfer = event.dataTransfer.getData('file');
    console.log('dataTransfer', event);
    //this.model.resume = dataTransfer;
    event.preventDefault();
  }

  onDragOver(event) {
    //console.log
    //event.dataTransfer.setData('file', event);
    event.stopPropagation();
    event.preventDefault();
  }

  apply() {
    this.loading = true;
    this.userService.apply(this.model)
      .subscribe(
          data => {
              this.alertService.success('Application successfully submitted.', true);
              this.router.navigate(['/home']);
          },
          error => {
              console.log(error);
              error = error.json();
              this.alertService.error(error.message);
              this.loading = false;
          });
  }

  private loadApplication() {
      this.loading = true;
      this.userService.getApplication()
        .subscribe(
          result => {
            this.loading = false;
            this.model = result;
            console.log(result);
            if(result.major)
              this.completer.SelectItem('completer', result.major);
            if(result.message === "success")
              this.appSubmitted = true;
            console.log(result);
          }, error => {
            console.log(error);
            this.loading = false;
            //this.alertService.error(error);
          }
      );
  }

  selectedMajor(item: SelectedAutocompleteItem) {
    this.model.major = item.item.title;
  }

}
