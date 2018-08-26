import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgAutoCompleteModule } from "ng-auto-complete";
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { routing } from './app.routing';

import { AuthGuard } from './auth.guard';
import { AdminGuard } from './admin.guard';

import { AppComponent } from './app.component';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ConfirmPasswordComponent } from './confirm-password/confirm-password.component';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';

import { UserService, ExecService, AuthService, AlertService, ApplicationService, UtilService} from './services/index';
import { HomeComponent } from './home/home.component';
import { CheckinComponent } from './checkin/checkin.component';
import { ApplicationComponent } from './application/application.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AnnouncementComponent } from './announcement/announcement.component';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { ApplicationsComponent } from './applications/applications.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CheckedInUsersComponent } from './checked-in-users/checked-in-users.component';

@NgModule({
  declarations: [
  AppComponent,
  LandingComponent,
  LoginComponent,
  RegisterComponent,
  ResetPasswordComponent,
  ConfirmPasswordComponent,
  ConfirmEmailComponent,
  CheckinComponent,
  HomeComponent,
  ApplicationComponent,
  NavbarComponent,
  AnnouncementComponent,
  AnnouncementsComponent,
  ApplicationsComponent,
  CheckedInUsersComponent
  ],
  imports: [
  BrowserModule,
  FormsModule,
  ReactiveFormsModule,
  HttpModule,
  routing,
  NgAutoCompleteModule,
  MatTableModule,
  MatSortModule,
  MatPaginatorModule,
  MatCheckboxModule,
  BrowserAnimationsModule
  ],
  providers: [
  AuthGuard,
  AuthService,
  UserService,
  ExecService,
  AlertService,
  ApplicationService,
  UtilService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
