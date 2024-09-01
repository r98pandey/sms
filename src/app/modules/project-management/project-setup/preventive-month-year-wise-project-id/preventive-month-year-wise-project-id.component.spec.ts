import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreventiveMonthYearWiseProjectIdComponent } from './preventive-month-year-wise-project-id.component';

describe('PreventiveMonthYearWiseProjectIdComponent', () => {
  let component: PreventiveMonthYearWiseProjectIdComponent;
  let fixture: ComponentFixture<PreventiveMonthYearWiseProjectIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PreventiveMonthYearWiseProjectIdComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreventiveMonthYearWiseProjectIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
