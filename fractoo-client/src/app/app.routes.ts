import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent) },
  { path: 'search', loadComponent: () => import('./pages/doctor-search/doctor-search.component').then(m => m.DoctorSearchComponent) },
  { path: 'doctor/:id', loadComponent: () => import('./pages/doctor-detail/doctor-detail.component').then(m => m.DoctorDetailComponent) },
  {
    path: 'my-appointments',
    loadComponent: () => import('./pages/my-appointments/my-appointments.component').then(m => m.MyAppointmentsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    children: [
      { path: '', loadComponent: () => import('./pages/admin/dashboard/dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'users', loadComponent: () => import('./pages/admin/manage-users/manage-users.component').then(m => m.ManageUsersComponent) },
      { path: 'doctors', loadComponent: () => import('./pages/admin/manage-doctors/manage-doctors.component').then(m => m.ManageDoctorsComponent) },
      { path: 'appointments', loadComponent: () => import('./pages/admin/manage-appointments/manage-appointments.component').then(m => m.ManageAppointmentsComponent) },
    ]
  },
  { path: '**', redirectTo: '' }
];
