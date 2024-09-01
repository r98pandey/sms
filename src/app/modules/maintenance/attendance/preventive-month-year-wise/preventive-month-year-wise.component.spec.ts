import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreventiveMonthYearWiseComponent } from './preventive-month-year-wise.component';

describe('PreventiveMonthYearWiseComponent', () => {
  let component: PreventiveMonthYearWiseComponent;
  let fixture: ComponentFixture<PreventiveMonthYearWiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PreventiveMonthYearWiseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreventiveMonthYearWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
