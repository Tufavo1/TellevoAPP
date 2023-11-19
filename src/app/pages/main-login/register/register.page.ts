import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { NavController, Animation, AnimationController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/authentication/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  @ViewChild('volver', { static: false }) volver!: ElementRef;
  @ViewChild('main', { static: false }) main!: ElementRef;
  @ViewChild('section', { static: false }) section!: ElementRef;

  fotoTomada: string | undefined;
  names: string = '';
  direccion: string = '';
  numero: string = '';
  fechaNacimiento: string = '';
  email: string = '';
  password: string = '';
  mostrarMensajeError: boolean = false;
  mensajeError: string = '';

  constructor(
    private navCtrl: NavController,
    private animationCtrl: AnimationController,
    private authService: AuthService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.animateHeader();
    this.animateMain();
    this.animateSection();
  }

  animateHeader() {
    const headerAnimation: Animation = this.animationCtrl.create()
      .addElement(this.volver.nativeElement)
      .duration(1000)
      .fromTo('opacity', '0', '1')
      .fromTo('transform', 'translateX(-20px)', 'translateX(0)');
    headerAnimation.play();
  }

  animateMain() {
    const contentAnimation: Animation = this.animationCtrl.create()
      .addElement(this.main.nativeElement)
      .duration(1000)
      .fromTo('opacity', '0', '1')
      .fromTo('transform', 'translateY(20px)', 'translateY(0)');
    contentAnimation.play();
  }

  animateSection() {
    const formAnimation: Animation = this.animationCtrl.create()
      .addElement(this.section.nativeElement)
      .duration(1000)
      .fromTo('opacity', '0', '1')
      .fromTo('transform', 'translateY(20px)', 'translateY(0)');
    formAnimation.play();
  }

  volverPaginaAnterior() {
    this.navCtrl.navigateForward('main-login/log-register-main');
  }

  //Aqui hare una validacion para que la contrasennia tenga minimo 6 caracteres
  //que contenga 1 mayuscula, 2 numeros y un caracter especial pero
  validarPassword(password: string): boolean {
    // Aqui verificara que la contrasennia tenga 6 digitos como minimo
    if (password.length < 6) {
      return false;
    }

    // Aqui se verificara que la contrasennia contenga 1 mayuscula
    if (!/[A-Z]/.test(password)) {
      return false;
    }

    // Aqui verificara que la contrasennia contenga 2 numeros
    if ((password.match(/[0-9]/g) || []).length < 2) {
      return false;
    }

    // Aqui se verificara que la contrasennia contenga 1 caracter especial
    if (!/[^a-zA-Z0-9]/.test(password)) {
      return false;
    }
    //si todo se cumple entonces cumplira con todo y no saldra el mensaje pero si
    //no tiene todo el return false le enviara el mensaje de alerta
    return true;
  }

  async registrar() {
    //Aqui cree una cadena que se usaran para verificar los campos vacios del form
    let camposFaltantes = '';
    //Aqui sera el mensaje error de los campos vacios
    let mensajeError = '';

    //Entonces si estos campos no estan llenos porque son obligatorios
    if (!this.names) {
      camposFaltantes += 'Nombre Completo, ';
    }
    if (!this.direccion) {
      camposFaltantes += 'Direccion de Domicilio, ';
    }
    if (!this.numero) {
      camposFaltantes += 'Numero De Telefono, ';
    }
    if (!this.fechaNacimiento) {
      camposFaltantes += 'Fecha de Nacimiento, ';
    }
    if (!this.email) {
      camposFaltantes += 'Correo, ';
    }
    if (!this.password) {
      camposFaltantes += 'Contraseña, ';
    } else if (!this.validarPassword(this.password)) {
      mensajeError = 'La contraseña debe tener al menos 6 caracteres, 1 mayúscula, 2 números y 1 carácter especial. ';
    }
    if (!this.fotoTomada) {
      camposFaltantes += 'Foto, ';
    }

    // Se encuentran dentro de estos campos algunos vacios,
    //muestre un mensaje solo los que falten como guia
    if (camposFaltantes) {
      camposFaltantes = camposFaltantes.slice(0, -2);

      // Aqui es la logica para el mensaje usando un controlador llamado 
      //ToastController
      const toast = await this.toastController.create({
        message: `Por favor, llena los siguientes campos: ${camposFaltantes}`,
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
      //Aqui si la ejecucion de la logica se encuentran campos vacios o la contrasennia
      //que no cumple con los requisitos(invalida) que detenga la logica(funcion)
      return;
    }

    // Pero si hay un mensaje error en la contrasennia que muestre un 
    //mensaje de error solo a la contrasennia
    if (mensajeError) {
      // Aqui lo mismo que la logica de arriba el mensaje error contrasennia 
      //Usando el Controlador ToastController
      const toast = await this.toastController.create({
        message: mensajeError,
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
      // Aqui si la ejecucion de la logica en la contrasennia se encuentra no cumpla
      //con los requisitos que detenga la funcion
      return;
    }

    // SI todos los campos estan llenos y la contrasennia es válida, que el usuario
    // Pueda continuar con el registro del usuario
    // Y que este registre al usuario en el Firebase y guarde información adicional en el localStorage
    this.authService
      .registrarUsuarioConInfo(this.email, this.password, {
        fotoTomada: this.fotoTomada,
        names: this.names,
        direccion: this.direccion,
        numero: this.numero,
        fechaNacimiento: this.fechaNacimiento,
        email: this.email,
      })
      .then(() => {
        // Entonces si todo fue con existo
        // que rediriga al usuario a la página "menu-drive/main"
        this.navCtrl.navigateForward('main-drive/main');
      })
      .catch((error) => {
        console.error('Error al registrar: ', error);
        // Aqui manejare los error de registro mas adelante
      });
  }

  async tomarFoto() {
    try {
      // el usuario tomara una foto
      const image = await Camera.getPhoto({
        //esta tendra una calidad
        quality: 90,
        //Esta no permitira editar
        allowEditing: false,
        //Esto dara como resultado: URL de datos
        resultType: CameraResultType.DataUrl,
        // la fuente sera la camara o archivos
        source: CameraSource.Camera,
      });

      // Aqui asigno que la imagen tomada se guarde a la propiedad fotoTomada
      this.fotoTomada = image.dataUrl;
    } catch (error) {
      //Pero en caso de error que muestre el error en la consola mas adelante manejare mejor el error
      console.error('Error al tomar la foto: ', error);
    }
  }

  borrarFoto() {
    // Este de aqui borrara la imagen tomada 
    this.fotoTomada = '';
  }

  IrAllogin() {
    this.navCtrl.navigateForward('main-login/login');
  }
}