import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrectiveMonthYearWiseComponent } from './corrective-month-year-wise.component';

describe('CorrectiveMonthYearWiseComponent', () => {
  let component: CorrectiveMonthYearWiseComponent;
  let fixture: ComponentFixture<CorrectiveMonthYearWiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CorrectiveMonthYearWiseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CorrectiveMonthYearWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
