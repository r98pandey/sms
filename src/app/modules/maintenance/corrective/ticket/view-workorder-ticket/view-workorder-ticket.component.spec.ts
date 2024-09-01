import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewWorkorderTicketComponent } from './view-workorder-ticket.component';

describe('ViewWorkorderTicketComponent', () => {
  let component: ViewWorkorderTicketComponent;
  let fixture: ComponentFixture<ViewWorkorderTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewWorkorderTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewWorkorderTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
