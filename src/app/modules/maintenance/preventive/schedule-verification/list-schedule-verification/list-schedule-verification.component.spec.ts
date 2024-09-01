import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListScheduleVerificationComponent } from './list-schedule-verification.component';

describe('ListScheduleVerificationComponent', () => {
  let component: ListScheduleVerificationComponent;
  let fixture: ComponentFixture<ListScheduleVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListScheduleVerificationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListScheduleVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
