import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOverDueTicketExternalAcknowledgeComponent } from './list-over-due-ticket-external-acknowledge.component';

describe('ListOverDueTicketExternalAcknowledgeComponent', () => {
  let component: ListOverDueTicketExternalAcknowledgeComponent;
  let fixture: ComponentFixture<ListOverDueTicketExternalAcknowledgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListOverDueTicketExternalAcknowledgeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListOverDueTicketExternalAcknowledgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
