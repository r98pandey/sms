import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmProjectScheduleComponent } from './pm-project-schedule.component';

describe('PmProjectScheduleComponent', () => {
  let component: PmProjectScheduleComponent;
  let fixture: ComponentFixture<PmProjectScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PmProjectScheduleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PmProjectScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
