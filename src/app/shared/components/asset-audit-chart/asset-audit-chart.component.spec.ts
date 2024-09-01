import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetAuditChartComponent } from './asset-audit-chart.component';

describe('AssetAuditChartComponent', () => {
  let component: AssetAuditChartComponent;
  let fixture: ComponentFixture<AssetAuditChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetAuditChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetAuditChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
