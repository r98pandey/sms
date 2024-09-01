import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubTaskWorkProgressListModalComponent } from './sub-task-work-progress-list-modal.component';

describe('SubTaskWorkProgressListModalComponent', () => {
  let component: SubTaskWorkProgressListModalComponent;
  let fixture: ComponentFixture<SubTaskWorkProgressListModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubTaskWorkProgressListModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubTaskWorkProgressListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
