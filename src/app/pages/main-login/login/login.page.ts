import { trigger, transition, style, animate } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavController, Animation, AnimationController } from '@ionic/angular';
import { AuthService } from 'src/app/services/authentication/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  //animaciones incorporadas
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 })),
      ]),
    ]),
  ],
})

export class LoginPage implements OnInit {

  isLoading: boolean = false;


  @ViewChild('volver', { static: false }) volver!: ElementRef;
  @ViewChild('main', { static: false }) main!: ElementRef;
  @ViewChild('cardfooter', { static: true }) cardFooter!: ElementRef;
  @ViewChild('footer', { static: false }) footer!: ElementRef;
  @ViewChild('form', { static: false }) form!: ElementRef;

  email: string = '';
  password: string = '';

  constructor(
    private navCtrl: NavController,
    private animationCtrl: AnimationController,
    private authService: AuthService,
  ) { }

  ngOnInit() {
  }

  //Animacion para el btn volver "ION-ICON"
  animateHeader() {
    const headerAnimation: Animation = this.animationCtrl.create()
      .addElement(this.volver.nativeElement)
      .duration(1000)
      .fromTo('opacity', '0', '1')
      .fromTo('transform', 'translateX(-20px)', 'translateX(0)');
    headerAnimation.play();
  }

  //Animacion para el contenido del ion-card "ion-card-content"
  animateCardContent() {
    const contentAnimation: Animation = this.animationCtrl.create()
      .addElement(this.main.nativeElement)
      .duration(1000)
      .fromTo('opacity', '0', '1')
      .fromTo('transform', 'translateY(20px)', 'translateY(0)');
    contentAnimation.play();
  }

  //Animacion para el contenido del formulario "form"
  animateForm() {
    const formAnimation: Animation = this.animationCtrl.create()
      .addElement(this.form.nativeElement)
      .duration(1000)
      .fromTo('opacity', '0', '1')
      .fromTo('transform', 'translateY(20px)', 'translateY(0)');
    formAnimation.play();
  }

  //Animacion para el contenido del footer card "ion-card-footer"
  animateCardFooter() {
    const cardFooterAnimation: Animation = this.animationCtrl.create()
      .addElement(this.cardFooter.nativeElement)
      .duration(1000)
      .fromTo('opacity', '0', '1')
      .fromTo('transform', 'translateY(20px)', 'translateY(0)');
    cardFooterAnimation.play();
  }

  //Animacion para el contenido del footer "ion-footer"
  animateFooter() {
    const footerAnimation: Animation = this.animationCtrl.create()
      .addElement(this.footer.nativeElement)
      .duration(1000)
      .fromTo('opacity', '0', '1')
      .fromTo('transform', 'translateY(20px)', 'translateY(0)');
    footerAnimation.play();
  }

  iniciarSesion() {
    this.isLoading = true;
    // Aqui se vera la utenticacion del usuario con el servicio authservices
    this.authService.iniciarSesion(this.email, this.password)
      .then(() => {
        this.isLoading = false;

        // Si el usuario ha iniciado con exito aqui que lo rediriga a la pagina main-drive
        this.navCtrl.navigateForward('main-drive/main');
      })
      .catch(error => {

        this.isLoading = false;

        console.error('Error al iniciar sesión: ', error);
        // Futuramente manejare este error con un mensaje o algo que se me ocurra
      });
  }

  IrAlrecuperar() {
    this.navCtrl.navigateForward('main-login/forgotpass');
  }

  IrAlregistro() {
    this.navCtrl.navigateForward('main-login/register');
  }

  volverPaginaAnterior() {
    this.navCtrl.navigateForward('main-login/log-register-main');
  }
}