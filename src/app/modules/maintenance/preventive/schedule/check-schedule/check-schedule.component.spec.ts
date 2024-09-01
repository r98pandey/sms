import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckScheduleComponent } from './check-schedule.component';

describe('CheckScheduleComponent', () => {
  let component: CheckScheduleComponent;
  let fixture: ComponentFixture<CheckScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckScheduleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
