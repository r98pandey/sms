import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedTicketListComponent } from './assigned-ticket-list.component';

describe('AssignedTicketListComponent', () => {
  let component: AssignedTicketListComponent;
  let fixture: ComponentFixture<AssignedTicketListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssignedTicketListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssignedTicketListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
