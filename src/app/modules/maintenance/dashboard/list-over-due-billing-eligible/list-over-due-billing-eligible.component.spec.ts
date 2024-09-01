import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOverDueBillingEligibleComponent } from './list-over-due-billing-eligible.component';

describe('ListOverDueBillingEligibleComponent', () => {
  let component: ListOverDueBillingEligibleComponent;
  let fixture: ComponentFixture<ListOverDueBillingEligibleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListOverDueBillingEligibleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListOverDueBillingEligibleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
