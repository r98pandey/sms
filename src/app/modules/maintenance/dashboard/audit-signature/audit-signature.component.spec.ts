import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditSignatureComponent } from './audit-signature.component';

describe('AuditSignatureComponent', () => {
  let component: AuditSignatureComponent;
  let fixture: ComponentFixture<AuditSignatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditSignatureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditSignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
