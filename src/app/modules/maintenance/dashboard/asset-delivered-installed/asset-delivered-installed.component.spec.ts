import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetDeliveredInstalledComponent } from './asset-delivered-installed.component';

describe('AssetDeliveredInstalledComponent', () => {
  let component: AssetDeliveredInstalledComponent;
  let fixture: ComponentFixture<AssetDeliveredInstalledComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetDeliveredInstalledComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetDeliveredInstalledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
