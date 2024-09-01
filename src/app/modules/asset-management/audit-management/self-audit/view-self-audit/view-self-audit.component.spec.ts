import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSelfAuditComponent } from './view-self-audit.component';

describe('ViewSelfAuditComponent', () => {
  let component: ViewSelfAuditComponent;
  let fixture: ComponentFixture<ViewSelfAuditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSelfAuditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSelfAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
