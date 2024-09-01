import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubTaskViewComponent } from './sub-task-view.component';

describe('SubTaskViewComponent', () => {
  let component: SubTaskViewComponent;
  let fixture: ComponentFixture<SubTaskViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubTaskViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubTaskViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
