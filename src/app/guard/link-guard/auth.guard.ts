import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';
import { AuthService } from 'src/app/services/authentication/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(redirectUrl?: string | UrlTree): Observable<boolean | UrlTree> {
    return this.authService.obtenerEstadoAutenticacion().pipe(
      take(1),
      tap(user => {
        if (!user) {
          this.authService.mostrarMensajeError('Inicia sesión para acceder.');
          this.router.navigate(['main-login/login']);
        }
      }),
      filter(user => !!user),
      tap(() => {
        // Aqui futuramente agregare una logica en para el auth
      })
    );
  }
}
