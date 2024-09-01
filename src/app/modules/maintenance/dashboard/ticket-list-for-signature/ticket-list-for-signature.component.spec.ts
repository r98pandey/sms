import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketListForSignatureComponent } from './ticket-list-for-signature.component';

describe('TicketListForSignatureComponent', () => {
  let component: TicketListForSignatureComponent;
  let fixture: ComponentFixture<TicketListForSignatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketListForSignatureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketListForSignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
