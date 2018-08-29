import 'rxjs/add/operator/switchMap';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { User } from "../user";
import { Application } from '../application';
import { saveAs as importedSaveAs } from "file-saver";

import { AuthService, AlertService, ExecService, UserService, ApplicationService } from "../services/index";

import 'rxjs/Rx';

@Component({
  selector: 'app-judge-application',
  templateUrl: './judge-application.component.html',
  styleUrls: ['./judge-application.component.scss']
})
export class JudgeApplicationComponent implements OnInit {

  model: any = {};
  loading = false;
  currentUser: User;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private alertService: AlertService,
    private execService: ExecService,
    private appService: ApplicationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.loadApplication();
  }

  private loadApplication(){
    this.loading = true;
    this.route.paramMap.switchMap((params: ParamMap) =>
      this.appService.getApplication(params.get('id')))
    .subscribe((application: Application) => {
      this.model = application;
      this.loading = false;
      console.log(application);
    });
  }

  private downloadResume() {
    if(this.model.file){
      this.execService.downloadResume(this.model.file.filename).subscribe(blob => {
          importedSaveAs(blob, this.model.firstName+"_"+this.model.lastName+".pdf");
      });
    } else {
      console.log("no resume");
    }
  }

  private downloadFile(data: any){
    //data = JSON.parse(body.toString());
    var blob = new Blob([data], { type: 'text/csv' });
    var url = window.URL.createObjectURL(blob);
    window.open(url);
  }

  public setStatus(status){
    this.loading = true;
    // this.appService.setStatus(this.application.id, status)
    //   .subscribe(
    //       data => {
    //           this.alertService.success('Application successfully updated.', true);
    //           //this.loading = false;
    //           //this.loadApplication();
    //           this.execService.getNextApplication()
    //             .subscribe(
    //               result => {
    //                 console.log(result);
    //                 if(result){
    //                   this.router.navigate(['/application/'+result.id]);
    //                 }
    //               }, error => {
    //                 console.log(error);
    //                 this.router.navigate(['/applications']);
    //                 this.loading = false;
    //               }
    //           );
    //       },
    //       error => {
    //           this.alertService.error(error);
    //           this.loading = false;
    //       });
    }


}
