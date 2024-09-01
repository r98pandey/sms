import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingforInvoiceProcessComponent } from './waitingfor-invoice-process.component';

describe('WaitingforInvoiceProcessComponent', () => {
  let component: WaitingforInvoiceProcessComponent;
  let fixture: ComponentFixture<WaitingforInvoiceProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WaitingforInvoiceProcessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaitingforInvoiceProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
