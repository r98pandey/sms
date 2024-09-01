import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectScheduleViewWithTaskComponent } from './project-schedule-view-with-task.component';

describe('ProjectScheduleViewWithTaskComponent', () => {
  let component: ProjectScheduleViewWithTaskComponent;
  let fixture: ComponentFixture<ProjectScheduleViewWithTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectScheduleViewWithTaskComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectScheduleViewWithTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
