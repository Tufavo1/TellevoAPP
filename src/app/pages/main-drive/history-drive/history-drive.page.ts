import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NavController, AlertController, AnimationController } from '@ionic/angular';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { FirestoreService } from 'src/app/services/firebase/store/firestore.service';

@Component({
  selector: 'app-history-drive',
  templateUrl: './history-drive.page.html',
  styleUrls: ['./history-drive.page.scss'],
})
export class HistoryDrivePage implements OnInit {

  historialCompras: any[] = [];
  userImage!: string;
  isLoading: boolean = false;

  constructor(
    private firestoreService: FirestoreService,
    private afAuth: AngularFireAuth,
    private navCtrl: NavController,
    private alertController: AlertController,
    private authService: AuthService,
    private animationCtrl: AnimationController
  ) {
    this.cargarImagenUsuario();

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

  ngOnInit() {
    this.isLoading = true;
    this.obtenerHistorialDesdeFirestore();
  }

  cargarImagenUsuario() {
    const userData = localStorage.getItem('registeredUser');
    if (userData) {
      const user = JSON.parse(userData);
      this.userImage = user.fotoTomada;
    }
  }

  abrirPerfil() {
    this.cargarImagenUsuario();
    this.navCtrl.navigateForward('main-drive/profile')
    this.realizarAnimacionSalida();
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

  async obtenerHistorialDesdeFirestore() {
    try {
      const user = await this.afAuth.currentUser;

      if (user) {
        const emailUsuario = user.email ?? '';

        this.firestoreService.obtenerHistorialCompras(emailUsuario).subscribe((historial) => {
          if (historial && historial.length > 0) {
            this.historialCompras = historial.map((compra: any) => ({
              ...compra,
              fecha: this.formatearFecha(compra.fecha),
              hora: this.formatearHora(compra.fecha)
            }));

            // Almacena el historial en el Local Storage
            localStorage.setItem('HistorialCompras', JSON.stringify(historial));

            // Desactiva el spinner isLoading
            this.isLoading = false;
          } else {
            console.log('No se encontró historial en Firestore.');
          }
        });
      } else {
        this.isLoading = false;
        console.log('Usuario no autenticado. No se puede obtener el historial de compras.');
      }
    } catch (error) {
      console.error('Error al obtener historial:', error);
      this.isLoading = false;
    }
  }


  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES');
  }

  formatearHora(fecha: string): string {
    return new Date(fecha).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  }

}