import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkProgressProjectTaskApporvalAccesRightComponent } from './work-progress-project-task-apporval-acces-right.component';

describe('WorkProgressProjectTaskApporvalAccesRightComponent', () => {
  let component: WorkProgressProjectTaskApporvalAccesRightComponent;
  let fixture: ComponentFixture<WorkProgressProjectTaskApporvalAccesRightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkProgressProjectTaskApporvalAccesRightComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkProgressProjectTaskApporvalAccesRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
