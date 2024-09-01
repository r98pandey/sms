import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectWorkProgressTaskDetailsComponent } from './project-work-progress-task-details.component';

describe('ProjectWorkProgressTaskDetailsComponent', () => {
  let component: ProjectWorkProgressTaskDetailsComponent;
  let fixture: ComponentFixture<ProjectWorkProgressTaskDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectWorkProgressTaskDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectWorkProgressTaskDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
