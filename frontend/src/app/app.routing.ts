import { Routes, RouterModule } from '@angular/router';

import { ApplicationComponent } from './application/application.component';
import { ApplicationsComponent } from './applications/applications.component';
import { JudgeApplicationComponent } from './judge-application/judge-application.component';
import { LandingComponent } from './landing/landing.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ConfirmPasswordComponent } from './confirm-password/confirm-password.component';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { CheckinComponent } from './checkin/checkin.component';
import { CheckedInUsersComponent } from './checked-in-users/checked-in-users.component';
import { AnnouncementComponent } from './announcement/announcement.component';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { DayofComponent } from './dayof/dayof.component';
import { AuthGuard } from './auth.guard';
import { AdminGuard } from './admin.guard';

const appRoutes: Routes = [
{ path: '', component: LandingComponent },
{ path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
{ path: 'apply', component: ApplicationComponent, canActivate: [AuthGuard] },
{ path: 'applications', component: ApplicationsComponent, canActivate: [AuthGuard, AdminGuard] },
{ path: 'application/:id', component: JudgeApplicationComponent, canActivate: [AuthGuard, AdminGuard] },
{ path: 'login', component: LoginComponent },
{ path: 'register', component: RegisterComponent },
{ path: 'resetPassword', component: ResetPasswordComponent },
{ path: 'confirmPassword', component: ConfirmPasswordComponent },
{ path: 'confirmEmail', component: ConfirmEmailComponent },
{ path: 'checkin', component: CheckinComponent },
{ path: 'checkedInUsers', component: CheckedInUsersComponent },
{ path: 'announcement', component: AnnouncementComponent },
// { path: 'announcements', component: AnnouncementsComponent },
{ path: 'dayof', component: DayofComponent },
{ path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes, { useHash: true });
