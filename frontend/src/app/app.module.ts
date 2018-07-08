import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
import { HttpModule } from '@angular/http';

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

import { UserService, AuthService, AlertService, ApplicationService, UtilService} from './services/index';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
  AppComponent,
  LandingComponent,
  LoginComponent,
  RegisterComponent,
  ResetPasswordComponent,
  ConfirmPasswordComponent,
  ConfirmEmailComponent,
  HomeComponent
  ],
  imports: [
  BrowserModule,
  FormsModule,
  ReactiveFormsModule,
  HttpModule,
  routing
  ],
  providers: [
  AuthGuard,
  AuthService,
  UserService,
  AlertService,
  ApplicationService,
  UtilService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
