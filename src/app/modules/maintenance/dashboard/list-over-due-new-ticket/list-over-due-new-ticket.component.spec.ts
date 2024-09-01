import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOverDueNewTicketComponent } from './list-over-due-new-ticket.component';

describe('ListOverDueNewTicketComponent', () => {
  let component: ListOverDueNewTicketComponent;
  let fixture: ComponentFixture<ListOverDueNewTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListOverDueNewTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListOverDueNewTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
