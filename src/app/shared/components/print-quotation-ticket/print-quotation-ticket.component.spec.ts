import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintQuotationTicketComponent } from './print-quotation-ticket.component';

describe('PrintQuotationTicketComponent', () => {
  let component: PrintQuotationTicketComponent;
  let fixture: ComponentFixture<PrintQuotationTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrintQuotationTicketComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrintQuotationTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
