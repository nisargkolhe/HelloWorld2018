import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgAutoCompleteModule } from "ng-auto-complete";

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
  AnnouncementsComponent
  ],
  imports: [
  BrowserModule,
  FormsModule,
  ReactiveFormsModule,
  HttpModule,
  routing,
  NgAutoCompleteModule
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
