import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetWarrantyListComponent } from './asset-warranty-list.component';

describe('AssetWarrantyListComponent', () => {
  let component: AssetWarrantyListComponent;
  let fixture: ComponentFixture<AssetWarrantyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetWarrantyListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetWarrantyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
