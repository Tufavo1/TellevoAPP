import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { FirestoreService } from 'src/app/services/firebase/store/firestore.service';

@Component({
  selector: 'app-paytrip',
  templateUrl: './paytrip.page.html',
  styleUrls: ['./paytrip.page.scss']
})

export class PaytripPage implements OnInit {
  cardHolderName: string = '';
  cardNumber: string = '';
  expMonth: string = '';
  expYear: string = '';
  cvc: string = '';
  vehiculoSeleccionado: any;
  userImage!: string;

  constructor(
    private firestoreService: FirestoreService,
    private afAuth: AngularFireAuth,
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    private alertController: AlertController,
    private authService: AuthService
  ) {
    this.cargarImagenUsuario();

    this.route.queryParams.subscribe(params => {
      const extras = this.router.getCurrentNavigation()?.extras;
      if (extras && 'state' in extras && extras.state) {
        this.vehiculoSeleccionado = extras.state['vehiculoSeleccionado'];
      }
    });
  }

  ngOnInit() {
  }

  async realizarPago() {
    try {
      if (!this.vehiculoSeleccionado) {
        console.log('No se ha seleccionado un vehículo.');
        return;
      }

      const cardData = {
        cardHolderName: this.cardHolderName,
        cardNumber: this.cardNumber,
        expMonth: Number(this.expMonth),
        expYear: Number(this.expYear),
        cvc: this.cvc,
      };

      if (!this.validarDatosPago(cardData)) {
        console.log('Por favor, complete todos los campos del formulario.');
        return;
      }

      const idTransaccion = await this.procesarPago(cardData);

      if (idTransaccion) {
        const user = await this.afAuth.currentUser;
        if (user) {
          const fechaActual = new Date();
          const pago = {
            titularPago: user.email,
            idTransaccion: idTransaccion,
            fecha: fechaActual.toISOString(),
            hora: fechaActual.toLocaleTimeString(),
            costo: this.vehiculoSeleccionado.costo,
            destino: this.vehiculoSeleccionado.destino,
            patente: this.vehiculoSeleccionado.patente,
          };

          this.firestoreService.agregarResumenCompra(pago)
            .then(() => {
              console.log('Pago guardado en Firestore con éxito.');

              this.mostrarMensajeAgradecimiento();
            })
            .catch((error) => {
              console.error('Error al guardar el pago en Firestore:', error);
            });
        } else {
          console.log('No se ha encontrado un usuario autenticado.');
        }
      }
    } catch (error) {
      console.error('Error al procesar el pago:', error);
    }
  }

  private validarDatosPago(cardData: any): boolean {
    return (
      cardData.cardHolderName &&
      cardData.cardNumber &&
      cardData.expMonth &&
      cardData.expYear &&
      cardData.cvc
    );
  }

  private generarIdTransaccion(): string {
    const fechaActual = new Date();
    const timestamp = fechaActual.getTime();
    const numeroAleatorio = Math.floor(Math.random() * 1000000);

    return `Tellevo${timestamp}${numeroAleatorio}`;
  }

  private procesarPago(cardData: any): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const idTransaccionGenerado = this.generarIdTransaccion();
        resolve(idTransaccionGenerado);
      }, 2000);
    });
  }


  async mostrarMensajeAgradecimiento() {
    const alert = await this.alertController.create({
      header: '¡Gracias por tu compra!',
      message: 'Tu pago se ha procesado con éxito.',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.navCtrl.navigateRoot('/main-drive/main');
          },
        },
      ],
    });

    await alert.present();
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
}