import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetAuditViewComponent } from './asset-audit-view.component';

describe('AssetAuditViewComponent', () => {
  let component: AssetAuditViewComponent;
  let fixture: ComponentFixture<AssetAuditViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetAuditViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetAuditViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
