import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTicketListComponent } from './view-ticket-list.component';

describe('ViewTicketListComponent', () => {
  let component: ViewTicketListComponent;
  let fixture: ComponentFixture<ViewTicketListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTicketListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewTicketListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
