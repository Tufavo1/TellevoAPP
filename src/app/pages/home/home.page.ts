import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SlideComponent } from './slide/slide.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, SlideComponent]
})
export class HomePage implements OnInit {

  slides: any[] = [];
  constructor(
    private router: Router
  ) { }

  async ngOnInit(): Promise<void> {
    this.slides = [
      {
        description: 'Descubre el mundo a través de TellevoApp, Tu compañero de viaje en la palma de tu mano.'
      },
      {
        description: 'Viaja con confianza, viaja con TellevoApp. ¡Tu aventura comienza aquí!'
      },
      {
        description: 'Encuentra tu próximo destino de ensueño con TellevoApp. ¡Explora, reserva, y viaja!'
      },
    ];
  }

  moveButton() {
    this.router.navigateByUrl('main-login/log-register-main')
  }
}