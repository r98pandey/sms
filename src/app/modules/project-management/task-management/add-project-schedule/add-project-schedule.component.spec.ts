import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProjectScheduleComponent } from './add-project-schedule.component';

describe('AddProjectScheduleComponent', () => {
  let component: AddProjectScheduleComponent;
  let fixture: ComponentFixture<AddProjectScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddProjectScheduleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddProjectScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
