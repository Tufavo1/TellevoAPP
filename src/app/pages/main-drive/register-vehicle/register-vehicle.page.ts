import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController, NavController, PopoverController, ToastController } from '@ionic/angular';
import { PopoverComponent } from './popover/popover.component';
import { FirestoreService } from 'src/app/services/firebase/store/firestore.service';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-vehicle',
  templateUrl: './register-vehicle.page.html',
  styleUrls: ['./register-vehicle.page.scss']
})
export class RegisterVehiclePage implements OnInit {
  //variables
  userImage!: Blob;
  userData: any = {};
  fotoTomada: string | undefined = '';
  vehiculoExistente: any;
  cargando: boolean = true;
  isUserLoggedIn: boolean = false;
  nombre: string | undefined = '';
  destino: string | undefined = '';
  rut: string | undefined = '';
  cantidad: string | undefined = '';
  patente: string | undefined = '';
  anio: string | undefined = '';
  modelo: string | undefined = '';
  costo: string | undefined = '';

  constructor(
    private navCtrl: NavController,
    private popoverController: PopoverController,
    private firestoreService: FirestoreService,
    private authService: AuthService,
    private toastController: ToastController,
    private router: Router,
    private alertController: AlertController,
  ) { }

  mostrarCarga() {
    this.cargando = true;
  }

  ocultarCarga() {
    this.cargando = false;
  }

  async presentPopover(event: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: event,
      translucent: true
    });
    return await popover.present();
  }

  async ngOnInit() {
    this.vehiculoExistente = null;

    const user = this.authService.obtenerDatosUsuarioRegistradoPorEmail();

    if (user) {
      const userEmail = user.email;

      const vehiculoExistente = await this.firestoreService.obtenerDatosDelVehiculo(userEmail);

      if (vehiculoExistente) {
        this.vehiculoExistente = vehiculoExistente;
      }
    }

    this.cargando = false;
  }

  navigateToHome() {
    this.navCtrl.navigateForward('/home');
  }

  navigateTohelp() {
    this.navCtrl.navigateForward('/twitter');
  }

  navigateTosettings() {
    this.navCtrl.navigateForward('/notifications');
  }

  navigateToUserProfile() {
    this.navCtrl.navigateForward('/profile');
  }

  volverPaginaAnterior() {
    this.navCtrl.navigateForward('main-drive/profile');
  }

  async tomarFoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      this.fotoTomada = image.dataUrl;
    } catch (error) {
      console.error('Error al tomar la foto: ', error);
    }
  }

  borrarFoto() {
    this.fotoTomada = '';
  }

  async mostrarMensajeConfirmacion() {
    // Define un mensaje de error para campos faltantes.
    let mensajeError = '';

    const nombre = (document.getElementById('nombreDuenio') as HTMLInputElement).value;
    const destino = (document.getElementById('destinoVehiculo') as HTMLInputElement).value;
    const rut = (document.getElementById('rut') as HTMLInputElement).value;
    const cantidad = (document.getElementById('cantidad') as HTMLInputElement).value;
    const patente = (document.getElementById('patenteVehiculo') as HTMLInputElement).value;
    const anio = (document.getElementById('anioVehiculo') as HTMLInputElement).value;
    const modelo = (document.getElementById('modeloVehiculo') as HTMLInputElement).value;
    const costo = (document.getElementById('costo') as HTMLInputElement).value;


    // Verifica cada campo y agrega al mensaje de error si es necesario.
    if (!nombre) {
      mensajeError += 'Nombre, ';
    }
    if (!destino) {
      mensajeError += 'Destino, ';
    }
    if (!rut) {
      mensajeError += 'Rut, ';
    }
    if (!cantidad) {
      mensajeError += 'Cantidad de pasajeros, ';
    }
    if (!patente) {
      mensajeError += 'Patente, ';
    }
    if (!anio) {
      mensajeError += 'Año del vehículo, ';
    }
    if (!modelo) {
      mensajeError += 'Modelo y marca del vehículo, ';
    }
    if (!costo) {
      mensajeError += 'Ingresar el costo de la siguiente manera: $ 12.000 ';
    }

    // Si hay campos faltantes, muestra un mensaje de error.
    if (mensajeError) {
      mensajeError = mensajeError.slice(0, -2); // Elimina la última coma y espacio.
      const toast = await this.toastController.create({
        message: `Por favor, llena los siguientes campos: ${mensajeError}`,
        duration: 10000,
        position: 'bottom',
        color: 'danger',
        buttons: [
          {
            text: 'Cerrar',
            role: 'cancel',
            handler: () => {
              console.log('Cerrar Toast');
            },
          },
        ],
      });
      toast.present();
      return; // Detén la ejecución si faltan campos.
    }

    // Si todos los campos están llenos, puedes continuar con la lógica de registro del vehículo aquí.
    // Añade la lógica para registrar el vehículo en Firestore o donde sea necesario.
    const userRegistrado = this.authService.obtenerDatosUsuarioRegistradoPorEmail();
    const userLogueado = this.authService.obtenerDatosUsuarioLogueado();

    if (userRegistrado || userLogueado) {
      const userEmail = (userLogueado && userLogueado.email) || (userRegistrado && userRegistrado.email);
      const vehiculoExistente = await this.firestoreService.obtenerDatosDelVehiculo(userEmail);

      if (vehiculoExistente) {
        this.vehiculoExistente = vehiculoExistente;
        console.log('Datos del vehículo existente:', vehiculoExistente);
      } else {
        const datosVehiculo = {
          nombre: nombre,
          destino: destino,
          rut: rut,
          cantidad: cantidad,
          patente: patente,
          anio: anio,
          modelo: modelo,
          costo: costo
        };

        this.firestoreService.agregarDatosDeVehiculo(datosVehiculo)
          .then(() => {
            console.log('Datos del vehículo agregados con éxito a Firestore');
          })
          .catch(error => {
            console.error('Error al agregar datos del vehículo a Firestore:', error);
          });
      }
    }
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

  mostrarHistorial() {
    this.navCtrl.navigateForward('main-drive/history-drive')
    console.log('Se ha hecho clic en historial');
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

  eliminarVehiculo() {
    this.firestoreService.eliminarVehiculo();
  }
}  