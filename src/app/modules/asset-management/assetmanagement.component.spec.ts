import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetmanagementComponent } from './assetmanagement.component';

describe('AssetmanagementComponent', () => {
  let component: AssetmanagementComponent;
  let fixture: ComponentFixture<AssetmanagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetmanagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetmanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
