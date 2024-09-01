import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSelfAuditComponent } from './list-self-audit.component';

describe('ListSelfAuditComponent', () => {
  let component: ListSelfAuditComponent;
  let fixture: ComponentFixture<ListSelfAuditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListSelfAuditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSelfAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
