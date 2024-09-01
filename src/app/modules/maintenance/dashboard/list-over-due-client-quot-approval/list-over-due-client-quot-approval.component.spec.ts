import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOverDueClientQuotApprovalComponent } from './list-over-due-client-quot-approval.component';

describe('ListOverDueClientQuotApprovalComponent', () => {
  let component: ListOverDueClientQuotApprovalComponent;
  let fixture: ComponentFixture<ListOverDueClientQuotApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListOverDueClientQuotApprovalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListOverDueClientQuotApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
