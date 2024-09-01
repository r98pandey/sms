import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskApprovalListComponent } from './task-approval-list.component';

describe('TaskApprovalListComponent', () => {
  let component: TaskApprovalListComponent;
  let fixture: ComponentFixture<TaskApprovalListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskApprovalListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaskApprovalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
