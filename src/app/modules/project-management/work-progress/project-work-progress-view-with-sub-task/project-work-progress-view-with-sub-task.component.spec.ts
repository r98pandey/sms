import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectWorkProgressViewWithSubTaskComponent } from './project-work-progress-view-with-sub-task.component';

describe('ProjectWorkProgressViewWithSubTaskComponent', () => {
  let component: ProjectWorkProgressViewWithSubTaskComponent;
  let fixture: ComponentFixture<ProjectWorkProgressViewWithSubTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectWorkProgressViewWithSubTaskComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectWorkProgressViewWithSubTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
