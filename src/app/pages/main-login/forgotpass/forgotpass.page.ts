import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavController, Animation, AnimationController } from '@ionic/angular';
import { AuthService } from 'src/app/services/authentication/auth.service';

@Component({
  selector: 'app-forgotpass',
  templateUrl: './forgotpass.page.html',
  styleUrls: ['./forgotpass.page.scss'],
})
export class ForgotpassPage implements OnInit {

  @ViewChild('volver', { static: false }) volver!: ElementRef;
  @ViewChild('main', { static: false }) main!: ElementRef;
  @ViewChild('form', { static: false }) form!: ElementRef;

  email: string = '';
  mensaje: string = '';

  constructor(
    private navCtrl: NavController,
    private animationCtrl: AnimationController,
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  // Esta funcion es para animar los elementos cuando entra
  ionViewDidEnter() {
    this.animateHeader();
    this.animateCardContent();
    this.animateForm();
  }

  // Animación para el botón de volver "ion-icon"
  animateHeader() {
    const headerAnimation: Animation = this.animationCtrl.create()
      .addElement(this.volver.nativeElement)
      .duration(1000)
      .fromTo('opacity', '0', '1')
      .fromTo('transform', 'translateX(-20px)', 'translateX(0)');
    headerAnimation.play();
  }

  // Animación para el contenido de card "ion-card"
  animateCardContent() {
    const contentAnimation: Animation = this.animationCtrl.create()
      .addElement(this.main.nativeElement)
      .duration(1000)
      .fromTo('opacity', '0', '1')
      .fromTo('transform', 'scale(0.5)', 'scale(1)');
    contentAnimation.play();
  }

  // Animación para el formulario "ion-card-content"
  animateForm() {
    const formAnimation: Animation = this.animationCtrl.create()
      .addElement(this.form.nativeElement)
      .duration(1000)
      .fromTo('opacity', '0', '1')
      .fromTo('transform', 'translateY(20px)', 'translateY(0)');
    formAnimation.play();
  }

  IrAlHome() {
    this.navCtrl.navigateForward('/home');
  }

  volverPaginaAnterior() {
    this.navCtrl.navigateForward('main-login/login');
  }

  enviarCorreoRecuperacion() {
    // Envía el correo de restablecimiento de contraseña utilizando el servicio AuthService
    this.authService.enviarCorreoRecuperacion(this.email)
      .then(() => {
        // El correo de restablecimiento se envió con éxito
        // Muestra un mensaje de éxito y redirige al usuario a la página de inicio de sesión
        this.mensaje = 'El link de recuperacion de Contrasennia se envio exitosamente, Revisa tu bandeja de entrada GMAIL.';
        setTimeout(() => {
          //Aqui se limpiara el mensaje despues de unos segundos
          this.mensaje = '';
          // y luego que se limpie redirigira al usuario al inicio de sesion
          this.navCtrl.navigateBack('main-login/login');
        }, 3000);
      })
      //En caso de un error que envie un error en caso que no pueda conectarse o en caso que no exista la cuenta
      .catch(error => {
        console.error('Error al enviar el correo de restablecimiento: ', error);
        this.mensaje = 'Error al enviar el correo de restablecimiento.';
      });
  }
}