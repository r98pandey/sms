import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectTaskMonthYearWiseComponent } from './project-task-month-year-wise.component';

describe('ProjectTaskMonthYearWiseComponent', () => {
  let component: ProjectTaskMonthYearWiseComponent;
  let fixture: ComponentFixture<ProjectTaskMonthYearWiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectTaskMonthYearWiseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectTaskMonthYearWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
