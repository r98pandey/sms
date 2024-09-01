import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubTaskWorkProgressViewComponent } from './sub-task-work-progress-view.component';

describe('SubTaskWorkProgressViewComponent', () => {
  let component: SubTaskWorkProgressViewComponent;
  let fixture: ComponentFixture<SubTaskWorkProgressViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubTaskWorkProgressViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubTaskWorkProgressViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
