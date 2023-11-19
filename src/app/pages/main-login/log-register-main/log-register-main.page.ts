import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavController, AnimationController, Animation } from '@ionic/angular';

@Component({
  selector: 'app-log-register-main',
  templateUrl: './log-register-main.page.html',
  styleUrls: ['./log-register-main.page.scss'],
})
export class LogRegisterMainPage implements OnInit {
  //Declaro los elementos con el ViewChild
  @ViewChild('volver', { static: false }) volver!: ElementRef;
  @ViewChild('main', { static: false }) main!: ElementRef;
  @ViewChild('btnes', { static: false }) btnes!: ElementRef;

  constructor(
    private navCtrl: NavController,
    private animationCtrl: AnimationController
  ) { }

  ngOnInit() {
  }

  //Funcion de animacion para los elementos 
  ionViewDidEnter() {
    this.animateHeader();
    this.animateCardContent();
    this.animateButtons();
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

  //Animacion para los btns "Iniciar-btns"
  animateButtons() {
    const buttonsAnimation: Animation = this.animationCtrl.create()
      .addElement(this.btnes.nativeElement)
      .duration(1000)
      .fromTo('opacity', '0', '1')
      .fromTo('transform', 'translateY(20px)', 'translateY(0)');
    buttonsAnimation.play();
  }

  volverPaginaAnterior() {
    this.navCtrl.navigateForward('/home');
  }
}