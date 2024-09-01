import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubTaskListModalComponent } from './sub-task-list-modal.component';

describe('SubTaskListModalComponent', () => {
  let component: SubTaskListModalComponent;
  let fixture: ComponentFixture<SubTaskListModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubTaskListModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubTaskListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
