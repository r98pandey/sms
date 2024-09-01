import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewViewAuditComponent } from './new-view-audit.component';

describe('NewViewAuditComponent', () => {
  let component: NewViewAuditComponent;
  let fixture: ComponentFixture<NewViewAuditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewViewAuditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewViewAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
