import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryAssetListCommonComponent } from './delivery-asset-list-common.component';

describe('DeliveryAssetListCommonComponent', () => {
  let component: DeliveryAssetListCommonComponent;
  let fixture: ComponentFixture<DeliveryAssetListCommonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryAssetListCommonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryAssetListCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
