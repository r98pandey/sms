import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOverDueInternalQuotationComponent } from './list-over-due-internal-quotation.component';

describe('ListOverDueInternalQuotationComponent', () => {
  let component: ListOverDueInternalQuotationComponent;
  let fixture: ComponentFixture<ListOverDueInternalQuotationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListOverDueInternalQuotationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListOverDueInternalQuotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
