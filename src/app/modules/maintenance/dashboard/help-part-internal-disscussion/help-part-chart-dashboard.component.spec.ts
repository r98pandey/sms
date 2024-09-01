import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpPartChartDashboardComponent } from './help-part-chart-dashboard.component';

describe('HelpPartChartDashboardComponent', () => {
  let component: HelpPartChartDashboardComponent;
  let fixture: ComponentFixture<HelpPartChartDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpPartChartDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpPartChartDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
