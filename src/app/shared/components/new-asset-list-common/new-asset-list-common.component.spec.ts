import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAssetListCommonComponent } from './new-asset-list-common.component';

describe('NewAssetListCommonComponent', () => {
  let component: NewAssetListCommonComponent;
  let fixture: ComponentFixture<NewAssetListCommonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewAssetListCommonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewAssetListCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
