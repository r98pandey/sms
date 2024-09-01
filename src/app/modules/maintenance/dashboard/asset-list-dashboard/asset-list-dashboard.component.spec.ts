import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetListDashboardComponent } from './asset-list-dashboard.component';

describe('AssetListDashboardComponent', () => {
  let component: AssetListDashboardComponent;
  let fixture: ComponentFixture<AssetListDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetListDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetListDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
