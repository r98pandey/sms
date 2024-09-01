import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAssetDashbaordComponent } from './new-asset-dashbaord.component';

describe('NewAssetDashbaordComponent', () => {
  let component: NewAssetDashbaordComponent;
  let fixture: ComponentFixture<NewAssetDashbaordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewAssetDashbaordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewAssetDashbaordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
