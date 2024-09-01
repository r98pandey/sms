import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskAttendanceComponent } from './task-attendance.component';

describe('TaskAttendanceComponent', () => {
  let component: TaskAttendanceComponent;
  let fixture: ComponentFixture<TaskAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskAttendanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
