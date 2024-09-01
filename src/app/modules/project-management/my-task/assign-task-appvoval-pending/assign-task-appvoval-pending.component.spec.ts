import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignTaskAppvovalPendingComponent } from './assign-task-appvoval-pending.component';

describe('AssignTaskAppvovalPendingComponent', () => {
  let component: AssignTaskAppvovalPendingComponent;
  let fixture: ComponentFixture<AssignTaskAppvovalPendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssignTaskAppvovalPendingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssignTaskAppvovalPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
