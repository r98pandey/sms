import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskEndServiceOrderComponent } from './task-end-service-order.component';

describe('TaskEndServiceOrderComponent', () => {
  let component: TaskEndServiceOrderComponent;
  let fixture: ComponentFixture<TaskEndServiceOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskEndServiceOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskEndServiceOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
