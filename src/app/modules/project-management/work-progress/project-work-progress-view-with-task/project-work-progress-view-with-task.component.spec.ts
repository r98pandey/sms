import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectWorkProgressViewWithTaskComponent } from './project-work-progress-view-with-task.component';

describe('ProjectWorkProgressViewWithTaskComponent', () => {
  let component: ProjectWorkProgressViewWithTaskComponent;
  let fixture: ComponentFixture<ProjectWorkProgressViewWithTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectWorkProgressViewWithTaskComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectWorkProgressViewWithTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
