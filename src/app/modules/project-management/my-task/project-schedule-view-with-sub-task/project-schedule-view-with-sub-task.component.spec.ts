import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectScheduleViewWithSubTaskComponent } from './project-schedule-view-with-sub-task.component';

describe('ProjectScheduleViewWithSubTaskComponent', () => {
  let component: ProjectScheduleViewWithSubTaskComponent;
  let fixture: ComponentFixture<ProjectScheduleViewWithSubTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectScheduleViewWithSubTaskComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectScheduleViewWithSubTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
