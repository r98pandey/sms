import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskEndAuditComponent } from './task-end-audit.component';

describe('TaskEndAuditComponent', () => {
  let component: TaskEndAuditComponent;
  let fixture: ComponentFixture<TaskEndAuditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskEndAuditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskEndAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
