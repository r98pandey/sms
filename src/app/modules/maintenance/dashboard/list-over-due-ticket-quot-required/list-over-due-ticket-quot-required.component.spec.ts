import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOverDueTicketQuotRequiredComponent } from './list-over-due-ticket-quot-required.component';

describe('ListOverDueTicketQuotRequiredComponent', () => {
  let component: ListOverDueTicketQuotRequiredComponent;
  let fixture: ComponentFixture<ListOverDueTicketQuotRequiredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListOverDueTicketQuotRequiredComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListOverDueTicketQuotRequiredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
