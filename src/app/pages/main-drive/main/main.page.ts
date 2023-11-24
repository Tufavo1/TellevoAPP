import { Component, OnInit } from '@angular/core';
import { AlertController, AnimationController, IonicModule, MenuController, NavController, PopoverController } from '@ionic/angular';
import { BannerComponent } from './banner/banner.component';
import { DataService } from 'src/app/services/shared-data/data.service';
import { Geolocation } from '@capacitor/geolocation';
import { AuthService } from 'src/app/services/authentication/auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
  standalone: true,
  imports: [IonicModule, BannerComponent]
})

export class MainPage implements OnInit {
  userImage!: string;
  userData: any = {};
  slides: any[] = [];

  get location(): string {
    return this.dataService.location;
  }

  get currentTime(): string {
    return this.dataService.getCurrentTime();
  }

  constructor(
    private dataService: DataService,
    private navCtrl: NavController,
    private alertController: AlertController,
    private authService: AuthService,
    private animationCtrl: AnimationController,
    private menuController: MenuController
  ) {
    this.cargarImagenUsuario();
  }

  abrirMenu() {
    this.menuController.open('nombreDelMenu');
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

  async ngOnInit(): Promise<void> {
    this.slides = [
      {
        banner: 'assets/img/fondos-banner/experiencia-programacion-persona-que-trabaja-codigos-computadora-730x730.jpg',
        description: 'En Duoc UC le abrimos las puertas a la tecnología e innovación con los fondos de Desarrollo Experimental'
      },
      {
        banner: 'assets/img/fondos-banner/DSC_9633-min-730x730.jpg',
        description: 'Mujeres líderes de la industria brindaron charlas magistrales en la primera edición de Security Woman'
      },
      {
        banner: 'assets/img/fondos-banner/MicrosoftTeams-image-21-730x730.jpg',
        description: 'La copa de los Juegos Olímpicos Duoc UC 2023 se queda nuevamente en sede Maipú'
      },
    ];

    try {
      const coordinates = await Geolocation.getCurrentPosition();
      await this.dataService.getLocationFromCoordinates(coordinates.coords.latitude, coordinates.coords.longitude);
    } catch (error) {
      console.error('Error al obtener la ubicación:', error);
    }
  }

  buscarViaje() {
    this.navCtrl.navigateForward('main-drive/viajar')
    console.log('Se ha hecho clic en Buscar Viaje');
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

  mostrarHistorial() {
    this.navCtrl.navigateForward('main-drive/history-drive')
    console.log('Se ha hecho clic en historial');
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
}