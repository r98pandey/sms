import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectScheduleListComponent } from './project-schedule-list.component';

describe('ProjectScheduleListComponent', () => {
  let component: ProjectScheduleListComponent;
  let fixture: ComponentFixture<ProjectScheduleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectScheduleListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectScheduleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
