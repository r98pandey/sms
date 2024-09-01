import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingforGenerateInvoicelistComponent } from './waitingfor-generate-invoicelist.component';

describe('WaitingforGenerateInvoicelistComponent', () => {
  let component: WaitingforGenerateInvoicelistComponent;
  let fixture: ComponentFixture<WaitingforGenerateInvoicelistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WaitingforGenerateInvoicelistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaitingforGenerateInvoicelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
