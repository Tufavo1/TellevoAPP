import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaytripPage } from './paytrip.page';

describe('PaytripPage', () => {
  let component: PaytripPage;
  let fixture: ComponentFixture<PaytripPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PaytripPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
