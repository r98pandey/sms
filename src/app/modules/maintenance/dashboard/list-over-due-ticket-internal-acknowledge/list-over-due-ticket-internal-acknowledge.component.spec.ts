import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOverDueTicketInternalAcknowledgeComponent } from './list-over-due-ticket-internal-acknowledge.component';

describe('ListOverDueTicketInternalAcknowledgeComponent', () => {
  let component: ListOverDueTicketInternalAcknowledgeComponent;
  let fixture: ComponentFixture<ListOverDueTicketInternalAcknowledgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListOverDueTicketInternalAcknowledgeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListOverDueTicketInternalAcknowledgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
