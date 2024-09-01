import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintViewTicketComponent } from './print-view-ticket.component';

describe('PrintViewTicketComponent', () => {
  let component: PrintViewTicketComponent;
  let fixture: ComponentFixture<PrintViewTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintViewTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintViewTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
