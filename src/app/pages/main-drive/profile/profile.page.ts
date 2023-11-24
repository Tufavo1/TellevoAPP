import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController, AnimationController, NavController, PopoverController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/authentication/auth.service';
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
    private alertController: AlertController,
    private popoverController: PopoverController,
    private firestoreService: FirestoreService,
    private afAuth: AngularFireAuth,
    private animationCtrl: AnimationController
  ) {
    this.userData = this.authService.obtenerDatosUsuarioRegistradoPorEmail();

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
    this.realizarAnimacionSalida();
  }

  mostrarHistorial() {
    this.navCtrl.navigateForward('main-drive/history-drive')
    this.realizarAnimacionSalida();
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
    this.realizarAnimacionSalida();
  }

  cerrarSesion() {
    this.authService.cerrarSesion()
  }

  registrarVehiculo() {
    this.navCtrl.navigateForward('main-drive/register-vehicle')
    this.realizarAnimacionSalida();
  }

  verDatosVehiculo() {
    this.navCtrl.navigateForward('main-drive/register-vehicle')
    this.realizarAnimacionSalida();
  }

  async eliminarCuenta() {
    try {
      //Aqui hago un mensaje de confirmacion
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
              // Esta constante obtiene el usuario logeado del local storage loggedUser
              const currentUser = this.authService.obtenerDatosUsuarioLogueado() || this.authService.obtenerDatosUsuarioRegistradoPorEmail();
              //Si 
              if (currentUser && currentUser.email) {
                // El usuario dice que si entonces que elimine los datos del usuario del firestore
                await this.firestoreService.eliminarDatosUsuario(currentUser.email);

                // y nuevamente que obtenga el usuario actual del auth y en el firestore
                const user = await this.afAuth.currentUser;

                // Si se verifica si el usuario esta autenticado
                if (user) {
                  // Elimine al usuario del firebase auth
                  await user.delete();
                }

                // Y que cierrre sesion y lo rediriga a la pagina de login
                await this.authService.cerrarSesion();
                //si hay algun error los manejare asi
              } else {
                // Usare un console log "error" para ver que hubo un problema al eliminar el usuario
                console.error('No se pudo obtener datos del usuario para eliminar la cuenta.');
              }
            }
          }
        ]
      });
      //Y este estara esperando la interaccion del usuario en caso de si o no
      await confirmAlert.present();
    } catch (error) {
      // Aqui manejare el error en caso que algo salga mal
      console.error('Error al eliminar la cuenta:', error);
    }
  }
}