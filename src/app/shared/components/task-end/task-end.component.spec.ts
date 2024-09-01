import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskEndComponent } from './task-end.component';

describe('TaskEndComponent', () => {
  let component: TaskEndComponent;
  let fixture: ComponentFixture<TaskEndComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskEndComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskEndComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
