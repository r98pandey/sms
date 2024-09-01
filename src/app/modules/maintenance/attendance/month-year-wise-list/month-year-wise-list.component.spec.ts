import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthYearWiseListComponent } from './month-year-wise-list.component';

describe('MonthYearWiseListComponent', () => {
  let component: MonthYearWiseListComponent;
  let fixture: ComponentFixture<MonthYearWiseListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MonthYearWiseListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MonthYearWiseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
