import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAddAuditComponent } from './new-add-audit.component';

describe('NewAddAuditComponent', () => {
  let component: NewAddAuditComponent;
  let fixture: ComponentFixture<NewAddAuditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewAddAuditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewAddAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
