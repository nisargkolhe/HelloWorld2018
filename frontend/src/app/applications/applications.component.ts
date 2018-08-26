import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { User } from "../user";
import { Application } from '../application';

import { MatSort, MatTableDataSource, PageEvent, MatPaginator } from '@angular/material';
import { AuthService, AlertService, ExecService, UserService } from "../services/index";

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})

export class ApplicationsComponent implements OnInit {
  currentUser: User;
  applications: Application[] = [];

  displayedColumns: string[] = ['firstName', 'lastName', 'gender', 'race', 'class_year', 'major', 'hackathon_count'];
  dataSource: any;
  hasResumeFilterApplied: boolean = false;
  loading = false;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private alertService: AlertService,
    private execService: ExecService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.currentUser = userService.loadFromLocalStorage();
    this.execService.getAllApplications()
      .subscribe(
        result => {
          this.applications = result;
          this.dataSource = new MatTableDataSource(result);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          console.log(result);
        }, error => {
          error = error.json()
          this.alertService.error(error.message);
          console.log(error);
        }
    );
  }

  onFilterChange(eve: any) {
    console.log("caught eve");
    this.hasResumeFilterApplied = !this.hasResumeFilterApplied;
    if(this.hasResumeFilterApplied) {
      let filteredApplications = this.applications.filter(app => app.file != undefined && app.file != null);
      console.log('filteredApplications', filteredApplications);
      this.dataSource = new MatTableDataSource(filteredApplications);
    } else {
      this.dataSource = new MatTableDataSource(this.applications);
    }

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    //this.dataSource.sort = this.sort;
  }

  ngAfterViewInit() {
    //this.dataSource.sort = this.sort;
  }

}
