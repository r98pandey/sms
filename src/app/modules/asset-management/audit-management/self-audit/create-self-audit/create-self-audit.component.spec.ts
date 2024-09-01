import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSelfAuditComponent } from './create-self-audit.component';

describe('CreateSelfAuditComponent', () => {
  let component: CreateSelfAuditComponent;
  let fixture: ComponentFixture<CreateSelfAuditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateSelfAuditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSelfAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
