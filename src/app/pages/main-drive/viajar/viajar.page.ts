import { Component, OnInit } from '@angular/core';
import { AlertController, AnimationController, NavController } from '@ionic/angular';
import { FirestoreService } from 'src/app/services/firebase/store/firestore.service';
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
  searchTerm: string = '';

  constructor(
    private firestoreService: FirestoreService,
    private navCtrl: NavController,
    private router: Router,
    private authService: AuthService,
    private alertController: AlertController,
    private animationCtrl: AnimationController

  ) {
    this.cargarImagenUsuario();
  }

  onSearchChange(event: any) {
    this.searchTerm = event.detail.value || '';
  }

  matchDestination(vehiculoDestino: string): boolean {
    return vehiculoDestino.toLowerCase().includes(this.searchTerm.toLowerCase());
  }

  ionViewDidEnter() {
    this.realizarAnimacionEntrada();
  }

  realizarAnimacionEntrada() {
    const contentElement = document.querySelector('#Content');
    if (contentElement) {
      const animation = this.animationCtrl
        .create()
        .addElement(contentElement)
        .duration(500)
        .fromTo('opacity', 0, 1)
        .fromTo('transform', 'translateY(20px)', 'translateY(0)');

      animation.play();
    }
  }

  realizarAnimacionSalida() {
    const contentElement = document.querySelector('#Content');
    if (contentElement) {
      const animation = this.animationCtrl
        .create()
        .addElement(contentElement)
        .duration(500)
        .fromTo('opacity', 1, 0)
        .fromTo('transform', 'translateY(0)', 'translateY(20px)');

      animation.play();
    }
  }

  realizarPago(vehiculo: any) {
    this.router.navigate(['main-drive/paytrip'], {
      state: { vehiculoSeleccionado: vehiculo }
    });
    this.realizarAnimacionSalida();
  }

  abrirPerfil() {
    this.cargarImagenUsuario();
    this.navCtrl.navigateForward('main-drive/profile')
    this.realizarAnimacionSalida();
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
    this.realizarAnimacionSalida();
  }

  cerrarSesion() {
    this.authService.cerrarSesion()
  }

  volverPaginaAnterior() {
    this.navCtrl.navigateForward('main-drive/main');
    this.realizarAnimacionSalida();
  }

  mostrarHistorial() {
    this.navCtrl.navigateForward('main-drive/history-drive')
    this.realizarAnimacionSalida();
  }
}