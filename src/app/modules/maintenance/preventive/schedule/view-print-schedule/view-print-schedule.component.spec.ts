import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPrintScheduleComponent } from './view-print-schedule.component';

describe('ViewPrintScheduleComponent', () => {
  let component: ViewPrintScheduleComponent;
  let fixture: ComponentFixture<ViewPrintScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPrintScheduleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPrintScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
