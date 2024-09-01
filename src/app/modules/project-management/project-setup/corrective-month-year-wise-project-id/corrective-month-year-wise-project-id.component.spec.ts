import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrectiveMonthYearWiseProjectIdComponent } from './corrective-month-year-wise-project-id.component';

describe('CorrectiveMonthYearWiseProjectIdComponent', () => {
  let component: CorrectiveMonthYearWiseProjectIdComponent;
  let fixture: ComponentFixture<CorrectiveMonthYearWiseProjectIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CorrectiveMonthYearWiseProjectIdComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CorrectiveMonthYearWiseProjectIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
