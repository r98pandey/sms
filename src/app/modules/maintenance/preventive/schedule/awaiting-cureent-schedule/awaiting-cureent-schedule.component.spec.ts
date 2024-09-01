import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AwaitingCureentScheduleComponent } from './awaiting-cureent-schedule.component';

describe('AwaitingCureentScheduleComponent', () => {
  let component: AwaitingCureentScheduleComponent;
  let fixture: ComponentFixture<AwaitingCureentScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AwaitingCureentScheduleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AwaitingCureentScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
