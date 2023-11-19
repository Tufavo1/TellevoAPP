import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogRegisterMainPage } from './log-register-main.page';

describe('LogRegisterMainPage', () => {
  let component: LogRegisterMainPage;
  let fixture: ComponentFixture<LogRegisterMainPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LogRegisterMainPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
