import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewIncidentTicketComponent } from './view-incident-ticket.component';

describe('ViewIncidentTicketComponent', () => {
  let component: ViewIncidentTicketComponent;
  let fixture: ComponentFixture<ViewIncidentTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewIncidentTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewIncidentTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
