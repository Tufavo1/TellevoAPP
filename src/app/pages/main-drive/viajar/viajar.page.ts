import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { FirestoreService } from 'src/app/services/firebase/store/firestore.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/authentication/auth.service';

@Component({
  selector: 'app-viajar',
  templateUrl: './viajar.page.html',
  styleUrls: ['./viajar.page.scss']
})
export class ViajarPage implements OnInit {
  vehiculosRegistrados: any[] = [];
  userImage!: string;
  loaded = false;
  skeletonData: any[] = [];

  constructor(
    private firestoreService: FirestoreService,
    private navCtrl: NavController,
    private router: Router,
    private authService: AuthService,
    private alertController: AlertController
  ) {
    this.cargarImagenUsuario();
  }

  realizarPago(vehiculo: any) {
    this.router.navigate(['main-drive/paytrip'], {
      state: { vehiculoSeleccionado: vehiculo }
    });
  }

  abrirPerfil() {
    this.cargarImagenUsuario();
    this.navCtrl.navigateForward('main-drive/profile')
  }

  cargarImagenUsuario() {
    const userData = localStorage.getItem('registeredUser');
    if (userData) {
      const user = JSON.parse(userData);
      this.userImage = user.fotoTomada;
    }
  }

  ngOnInit() {
    this.firestoreService.obtenerVehiculosRegistrados().subscribe((vehiculos) => {
      this.vehiculosRegistrados = vehiculos;
      this.loaded = true;
    });
  }

  async mostrarConfirmacionCerrarSesion() {
    const alert = await this.alertController.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro de que deseas abandonar 😞?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancelar');
          },
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.cerrarSesion();
          },
        },
      ],
    });

    await alert.present();
  }

  cerrarSesion() {
    this.authService.cerrarSesion()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch(error => {
        console.error('Error al cerrar sesión: ', error);
      });
  }

  volverPaginaAnterior() {
    this.navCtrl.navigateForward('main-drive/main');
  }

  mostrarHistorial() {
    this.navCtrl.navigateForward('main-drive/history-drive')
    console.log('Se ha hecho clic en historial');
  }
}