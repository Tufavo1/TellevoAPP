import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { IonicSlides } from '@ionic/angular';

@Component({
  selector: 'app-slide',
  templateUrl: './slide.component.html',
  styleUrls: ['./slide.component.scss'],
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SlideComponent implements OnInit {

  @Input() slides: any[] = [];
  swiperModules = [IonicSlides];
  @ViewChild('Swiper')
  swiperRef: ElementRef | undefined;

  constructor() { }

  ngOnInit() { }

  onSlideChange(event: any) {
  }
}