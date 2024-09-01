import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalenderScheduleComponent } from './calender-schedule.component';

describe('CalenderScheduleComponent', () => {
  let component: CalenderScheduleComponent;
  let fixture: ComponentFixture<CalenderScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalenderScheduleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalenderScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
