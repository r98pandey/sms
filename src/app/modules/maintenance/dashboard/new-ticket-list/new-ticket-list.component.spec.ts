import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTicketListComponent } from './new-ticket-list.component';

describe('NewTicketListComponent', () => {
  let component: NewTicketListComponent;
  let fixture: ComponentFixture<NewTicketListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewTicketListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewTicketListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
