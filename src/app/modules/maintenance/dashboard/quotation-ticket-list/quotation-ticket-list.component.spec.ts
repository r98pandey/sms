import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationTicketListComponent } from './quotation-ticket-list.component';

describe('QuotationTicketListComponent', () => {
  let component: QuotationTicketListComponent;
  let fixture: ComponentFixture<QuotationTicketListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotationTicketListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuotationTicketListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
