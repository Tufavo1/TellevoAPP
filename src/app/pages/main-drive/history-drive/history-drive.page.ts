import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';
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
    private router: Router,
    private navCtrl: NavController,
    private alertController: AlertController,
    private authService: AuthService
  ) {
    this.cargarImagenUsuario();

  }

  ngOnInit() {
    this.isLoading = true;
    this.obtenerHistorialDesdeLocalStorageOFirestore();
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


  async obtenerHistorialDesdeLocalStorageOFirestore() {
    try {
      const user = await this.afAuth.currentUser;

      if (user) {
        const emailUsuario = user.email ?? '';

        // Intenta obtener el historial desde el localStorage
        const historialLocalStorage = localStorage.getItem('resumenCompra');

        if (historialLocalStorage) {
          try {
            // Intenta parsear el historial como JSON
            const historialParsed = JSON.parse(historialLocalStorage);

            // Verifica si el historialParsed es un array
            if (Array.isArray(historialParsed)) {
              // Si existe en el localStorage y es un array, úsalo
              this.historialCompras = historialParsed.map((compra: any) => ({
                ...compra,
                fecha: this.formatearFecha(compra.fecha),
                hora: this.formatearHora(compra.fecha)
              }));
              // Establecer isLoading en false cuando el historial se carga desde localStorage
              this.isLoading = false;
            } else {
              // Manejar el caso en el que el historialParsed no es un array
              console.error('El historial almacenado no es un array válido.');
              this.isLoading = false;
            }
          } catch (error) {
            // Manejar errores de JSON.parse
            console.error('Error al parsear el historial almacenado:', error);
            this.isLoading = false;
          }
        } else {
          // Si no existe en el localStorage, obténlo desde Firestore
          this.firestoreService.obtenerHistorialCompras(emailUsuario).subscribe((historial) => {
            if (historial && historial.length > 0) {
              // Formatear la fecha antes de mostrarla
              this.historialCompras = historial.map((compra: any) => ({
                ...compra,
                fecha: this.formatearFecha(compra.fecha),
                hora: this.formatearHora(compra.fecha)
              }));

              // Almacena el historial obtenido en el localStorage para futuras consultas
              localStorage.setItem('resumenCompra', JSON.stringify(historial));
            } else {
              // Puedes manejar el caso en que no hay historial en Firestore
              console.log('No se encontró historial en Firestore.');
            }

            // Establecer isLoading en false después de cargar desde Firestore
            this.isLoading = false;
          });
        }
      } else {
        // Usuario no autenticado
        this.isLoading = false;
        console.log('Usuario no autenticado. No se puede obtener el historial de compras.');
      }
    } catch (error) {
      // Manejar errores, por ejemplo, mostrar un mensaje al usuario o registrar el error.
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