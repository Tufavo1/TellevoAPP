import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { AuthService } from 'src/app/services/authentication/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }
  
  canActivate(): Observable<boolean> {
    return this.authService.obtenerEstadoAutenticacion().pipe(
      take(1),
      map(user => {
        if (user) {
          return true;
        } else {
          this.authService.mostrarMensajeError('Inicia sesión para acceder.');
          this.router.navigate(['main-login/login']);
          return false;
        }
      })
    );
  }
}