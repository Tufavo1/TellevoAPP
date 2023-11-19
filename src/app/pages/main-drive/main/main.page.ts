import { Component, OnInit } from '@angular/core';
import { AlertController, IonicModule, NavController, PopoverController } from '@ionic/angular';
import { BannerComponent } from './banner/banner.component';
import { DataService } from 'src/app/services/shared-data/data.service';
import { Geolocation } from '@capacitor/geolocation';
import { PopoverComponent } from '../register-vehicle/popover/popover.component';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { Router } from '@angular/router';

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
    private popoverController: PopoverController,
    private alertController: AlertController,
    private authService: AuthService,
    private router: Router,
  ) {
    this.cargarImagenUsuario();
  }

  async presentPopover(event: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: event,
      translucent: true
    });
    return await popover.present();
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

  mostrarHistorial() {
    this.navCtrl.navigateForward('main-drive/history-drive')
    console.log('Se ha hecho clic en historial');
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
}