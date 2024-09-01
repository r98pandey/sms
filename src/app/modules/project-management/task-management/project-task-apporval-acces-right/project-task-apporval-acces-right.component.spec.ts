import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectTaskApporvalAccesRightComponent } from './project-task-apporval-acces-right.component';

describe('ProjectTaskApporvalAccesRightComponent', () => {
  let component: ProjectTaskApporvalAccesRightComponent;
  let fixture: ComponentFixture<ProjectTaskApporvalAccesRightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectTaskApporvalAccesRightComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectTaskApporvalAccesRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
