import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowTicketListComponent } from './workflow-ticket-list.component';

describe('WorkflowTicketListComponent', () => {
  let component: WorkflowTicketListComponent;
  let fixture: ComponentFixture<WorkflowTicketListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkflowTicketListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkflowTicketListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
