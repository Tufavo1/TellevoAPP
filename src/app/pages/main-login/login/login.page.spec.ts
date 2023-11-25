import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { LoginPage } from './login.page';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [
        IonicModule.forRoot(),
        FormsModule,
        RouterTestingModule
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call iniciarSesion method on button click', fakeAsync(() => {
    spyOn(component, 'iniciarSesion');

    const button = fixture.debugElement.query(By.css('.iniciarbtn')).nativeElement;
    button.click();
    tick();

    expect(component.iniciarSesion).toHaveBeenCalled();
  }));
});
