import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTaskModalWorkProgressComponent } from './add-task-modal-work-progress.component';

describe('AddTaskModalWorkProgressComponent', () => {
  let component: AddTaskModalWorkProgressComponent;
  let fixture: ComponentFixture<AddTaskModalWorkProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddTaskModalWorkProgressComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddTaskModalWorkProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
