import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotpassPage } from './forgotpass.page';

describe('ForgotpassPage', () => {
  let component: ForgotpassPage;
  let fixture: ComponentFixture<ForgotpassPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ForgotpassPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
