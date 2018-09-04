import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { User } from "../user";
import { Application } from '../application';

import { MatSort, MatTableDataSource, PageEvent, MatPaginator } from '@angular/material';
import { AuthService, AlertService, ExecService, UserService, ApplicationService } from "../services/index";

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})

export class ApplicationsComponent implements OnInit {
  currentUser: User;
  applications: Application[] = [];
  statuses: ["accepted", "waitlisted", "rejected"];
  displayedColumns: string[] = ['firstName', 'lastName', 'gender', 'class_year', 'major', 'hackathon_count', 'status'];
  dataSource: any;
  hasResumeFilterApplied: boolean = false;
  hasPendingFilterApplied: boolean = false;
  loading = false;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private alertService: AlertService,
    private execService: ExecService,
    private appService: ApplicationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.currentUser = userService.loadFromLocalStorage();
    //this.loading = true;
    this.loadApplications();
  }

  loadApplications() {
    this.execService.getAllApplications()
      .subscribe(
        result => {
          this.loading = false;
          this.applications = result;
          this.dataSource = new MatTableDataSource(result);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          console.log(result);
        }, error => {
          this.loading = false;
          error = error.json()
          this.alertService.error(error.message);
          console.log(error);
        }
    );
  }

  onFilterChange() {
    console.log("caught eve");
    //this.hasResumeFilterApplied = !this.hasResumeFilterApplied;
    let filteredApplications = this.applications;
    if(this.hasResumeFilterApplied) {
      filteredApplications = filteredApplications.filter(app => app.file != undefined && app.file != null);
      console.log('filteredApplications', filteredApplications);
    }

    if (this.hasPendingFilterApplied) {
      filteredApplications = filteredApplications.filter(app => app.status == 'pending');
      console.log('filteredApplications', filteredApplications);
    }

    this.dataSource = new MatTableDataSource(filteredApplications);

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public setStatus(event, id, status){
    event.stopPropagation();
    event.preventDefault();
    this.appService.setStatus(id, status)
      .subscribe(
          data => {
              this.alertService.success('Application successfully updated.', true);
              this.loadApplications();
              //this.loading = false;
          },
          error => {
              this.alertService.error(error);
              this.loading = false;
          });
    }

  ngOnInit() {
    //this.dataSource.sort = this.sort;
  }

  ngAfterViewInit() {
    //this.dataSource.sort = this.sort;
    this.dataSource = new MatTableDataSource([]);
  }

  applicationClicked(app: any) {
    //console.log(eve);
    this.router.navigate(['/application/'+app._id]);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
