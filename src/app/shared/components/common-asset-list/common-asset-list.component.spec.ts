import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonAssetListComponent } from './common-asset-list.component';

describe('CommonAssetListComponent', () => {
  let component: CommonAssetListComponent;
  let fixture: ComponentFixture<CommonAssetListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonAssetListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonAssetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
