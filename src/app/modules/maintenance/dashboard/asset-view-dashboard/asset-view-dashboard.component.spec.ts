import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetViewDashboardComponent } from './asset-view-dashboard.component';

describe('AssetViewDashboardComponent', () => {
  let component: AssetViewDashboardComponent;
  let fixture: ComponentFixture<AssetViewDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetViewDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetViewDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
