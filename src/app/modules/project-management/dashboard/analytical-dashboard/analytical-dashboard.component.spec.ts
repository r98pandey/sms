import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticalDashboardComponent } from './analytical-dashboard.component';

describe('AnalyticalDashboardComponent', () => {
  let component: AnalyticalDashboardComponent;
  let fixture: ComponentFixture<AnalyticalDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnalyticalDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnalyticalDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
