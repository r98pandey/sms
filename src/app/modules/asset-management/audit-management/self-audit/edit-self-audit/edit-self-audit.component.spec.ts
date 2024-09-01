import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSelfAuditComponent } from './edit-self-audit.component';

describe('EditSelfAuditComponent', () => {
  let component: EditSelfAuditComponent;
  let fixture: ComponentFixture<EditSelfAuditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSelfAuditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSelfAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
