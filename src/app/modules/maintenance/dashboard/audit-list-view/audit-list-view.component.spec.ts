import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditListViewComponent } from './audit-list-view.component';

describe('AuditListViewComponent', () => {
  let component: AuditListViewComponent;
  let fixture: ComponentFixture<AuditListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditListViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
