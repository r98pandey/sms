import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectTaskMonthYearWiseProjectIdComponent } from './project-task-month-year-wise-project-id.component';

describe('ProjectTaskMonthYearWiseProjectIdComponent', () => {
  let component: ProjectTaskMonthYearWiseProjectIdComponent;
  let fixture: ComponentFixture<ProjectTaskMonthYearWiseProjectIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectTaskMonthYearWiseProjectIdComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectTaskMonthYearWiseProjectIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
