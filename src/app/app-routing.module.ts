import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/link-guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  //aqui llamo a la carpeta y llamo a las subcarpetas y les agrego un authguard para que impida volver a estas al momento de cerrar
  {
    path: 'main-login',
    children: [
      {
        path: 'log-register-main',
        loadChildren: () => import('./pages/main-login/log-register-main/log-register-main.module').then(m => m.LogRegisterMainPageModule)
      },
      {
        path: 'forgotpass',
        loadChildren: () => import('./pages/main-login/forgotpass/forgotpass.module').then(m => m.ForgotpassPageModule)
      },
      {
        path: 'login',
        loadChildren: () => import('./pages/main-login/login/login.module').then(m => m.LoginPageModule)
      },
      {
        path: 'register',
        loadChildren: () => import('./pages/main-login/register/register.module').then(m => m.RegisterPageModule)
      },
    ]
  },
  //aqui llamo a la carpeta y llamo a las subcarpetas
  {
    path: 'main-drive',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'main',
        loadChildren: () => import('./pages/main-drive/main/main.module').then(m => m.MainPageModule)
      },
      {
        path: 'register-vehicle',
        loadChildren: () => import('./pages/main-drive/register-vehicle/register-vehicle.module').then(m => m.RegisterVehiclePageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./pages/main-drive/profile/profile.module').then(m => m.ProfilePageModule)
      },
      {
        path: 'viajar',
        loadChildren: () => import('./pages/main-drive/viajar/viajar.module').then(m => m.ViajarPageModule)
      },
      {
        path: 'paytrip',
        loadChildren: () => import('./pages/main-drive/paytrip/paytrip.module').then(m => m.PaytripPageModule)
      },
      {
        path: 'history-drive',
        loadChildren: () => import('./pages/main-drive/history-drive/history-drive.module').then(m => m.HistoryDrivePageModule)
      },
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
