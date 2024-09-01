import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignMainTaskSubTaskListComponent } from './assign-main-task-sub-task-list.component';

describe('AssignMainTaskSubTaskListComponent', () => {
  let component: AssignMainTaskSubTaskListComponent;
  let fixture: ComponentFixture<AssignMainTaskSubTaskListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssignMainTaskSubTaskListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssignMainTaskSubTaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
