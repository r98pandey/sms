import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskListDashbaordComponent } from './task-list-dashbaord.component';

describe('TaskListDashbaordComponent', () => {
  let component: TaskListDashbaordComponent;
  let fixture: ComponentFixture<TaskListDashbaordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskListDashbaordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaskListDashbaordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
