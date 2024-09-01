import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditChartComponent } from './audit-chart.component';

describe('AuditChartComponent', () => {
  let component: AuditChartComponent;
  let fixture: ComponentFixture<AuditChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
