import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoryDrivePage } from './history-drive.page';

describe('HistoryDrivePage', () => {
  let component: HistoryDrivePage;
  let fixture: ComponentFixture<HistoryDrivePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(HistoryDrivePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
