import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { IonicSlides } from '@ionic/angular';
import { DataService } from 'src/app/services/shared-data/data.service';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BannerComponent  implements OnInit {

  @Input() slides: any[] = [];
  swiperModules = [IonicSlides];
  @ViewChild('Swiper')
  swiperRef: ElementRef | undefined;
  location: string = 'Ubicación no disponible';

  constructor(
    private data: DataService
  ) { }

  ngOnInit() {
    this.getCurrentLocation();
  }

  async getCurrentLocation() {
    const coordinates = await Geolocation.getCurrentPosition();
    const location = `Lat: ${coordinates.coords.latitude}, Lng: ${coordinates.coords.longitude}`;
    this.data.setLocation(location);
  }

  onSlideChange(event: any) {
    console.log(this.swiperRef?.nativeElement.swiper.activeIndex);
    console.log('event', event);
  }
}
