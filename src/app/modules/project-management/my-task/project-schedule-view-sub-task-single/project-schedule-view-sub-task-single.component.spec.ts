import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectScheduleViewSubTaskSingleComponent } from './project-schedule-view-sub-task-single.component';

describe('ProjectScheduleViewSubTaskSingleComponent', () => {
  let component: ProjectScheduleViewSubTaskSingleComponent;
  let fixture: ComponentFixture<ProjectScheduleViewSubTaskSingleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectScheduleViewSubTaskSingleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectScheduleViewSubTaskSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
