import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController, NavController, PopoverController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { PopoverComponent } from '../register-vehicle/popover/popover.component';
import { FirestoreService } from 'src/app/services/firebase/store/firestore.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss']
})
export class ProfilePage implements OnInit {
  userData: any = {
    fotoTomada: '',
    email: '',
    numero: '',
  }

  editMode = false;
  guardandoCambios = false;
  cambiosRealizados = false;
  estadoOriginal: any;
  tieneVehiculo: boolean = false;

  constructor(
    private navCtrl: NavController,
    private toastController: ToastController,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private popoverController: PopoverController,
    private firestoreService: FirestoreService,
    private afAuth: AngularFireAuth,
  ) {
    this.userData = this.authService.obtenerDatosUsuarioRegistradoPorEmail();

  }

  activarEdicion() {
    this.editMode = true;
    this.estadoOriginal = { ...this.userData };
  }

  guardarCambios() {
    this.guardandoCambios = true;

    setTimeout(() => {
      this.guardandoCambios = false;
      this.editMode = false;
      this.cambiosRealizados = false;
      this.estadoOriginal = null;
    }, 2000);
  }

  cancelarEdicion() {
    if (this.cambiosRealizados) {
      this.userData = { ...this.estadoOriginal };
    }

    this.editMode = false;
    this.cambiosRealizados = false;
    this.estadoOriginal = null;
  }

  onCampoCambiado() {
    this.cambiosRealizados = true;
  }

  async presentPopover(event: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: event,
      translucent: true
    });
    return await popover.present();
  }

  ngOnInit() {
    if (!this.userData) {
      const registeredUserData = this.authService.obtenerDatosUsuarioRegistradoPorEmail();

      if (registeredUserData) {
        this.userData = registeredUserData;
      }
    }
    this.verificarVehiculoRegistrado();
  }

  async verificarVehiculoRegistrado() {
    const user = await this.firestoreService.getAuthInstance().currentUser;

    if (user) {
      const userEmail = user.email;

      if (userEmail) {
        const vehiculoData = await this.firestoreService.obtenerDatosDelVehiculo(userEmail);

        if (vehiculoData) {
          this.tieneVehiculo = true;
        }
      }
    }
  }

  volverPaginaAnterior() {
    this.navCtrl.navigateForward('main-drive/main');
  }

  mostrarHistorial() {
    this.navCtrl.navigateForward('main-drive/history-drive')
    console.log('Se ha hecho clic en historial');
  }

  cambiarImagen() {
    this.tomarFoto().then(() => {
      localStorage.setItem('registeredUser', JSON.stringify(this.userData));
    });
  }

  async tomarFoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      this.userData.fotoTomada = image.dataUrl;
    } catch (error) {
      console.error('Error al tomar la foto: ', error);
    }
  }

  async mostrarMensajeError(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      position: 'top'
    });
    toast.present();
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

  registrarVehiculo() {
    this.navCtrl.navigateForward('main-drive/register-vehicle')
  }

  verDatosVehiculo() {
    this.navCtrl.navigateForward('main-drive/register-vehicle')
  }

  async eliminarCuenta() {
    try {
      // Mostrar mensaje de confirmación
      const confirmAlert = await this.alertController.create({
        header: 'Confirmación',
        message: '¿Estás seguro que quieres eliminar tu cuenta?',
        buttons: [
          {
            text: 'No quiero eliminar',
            role: 'cancel',
            handler: () => {
              console.log('Cancelado');
            }
          },
          {
            text: 'Sí, Quiero Eliminar mi cuenta',
            handler: async () => {
              // Obtener el usuario actualmente autenticado
              const currentUser = this.authService.obtenerDatosUsuarioLogueado() || this.authService.obtenerDatosUsuarioRegistradoPorEmail();

              if (currentUser && currentUser.email) {
                // Eliminar datos del usuario de los collections en Firestore
                await this.firestoreService.eliminarDatosUsuario(currentUser.email);

                // Obtener el usuario actual en Firebase Authentication
                const user = await this.afAuth.currentUser;

                // Verificar si el usuario está autenticado en Firebase Authentication
                if (user) {
                  // Eliminar usuario de Firebase Authentication
                  await user.delete();
                }

                // Cerrar sesión y redirigir a la página de inicio de sesión
                await this.authService.cerrarSesion();
              } else {
                // Manejar el caso donde no se puede obtener el usuario actual ni por email registrado
                console.error('No se pudo obtener información del usuario para eliminar la cuenta.');

                // Aquí puedes agregar lógica adicional, como mostrar un mensaje al usuario
                this.mostrarMensajeError('No se pudo encontrar información del usuario.');
              }
            }
          }
        ]
      });

      await confirmAlert.present();
    } catch (error) {
      // Aqui manejare el error en caso que algo salga mal
      console.error('Error al eliminar la cuenta:', error);
    }
  }
}