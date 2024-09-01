import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewQuotationTicketComponent } from './view-quotation-ticket.component';

describe('ViewQuotationTicketComponent', () => {
  let component: ViewQuotationTicketComponent;
  let fixture: ComponentFixture<ViewQuotationTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewQuotationTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewQuotationTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
