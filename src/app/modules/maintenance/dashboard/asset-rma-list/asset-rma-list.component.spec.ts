import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetRMAListComponent } from './asset-rma-list.component';

describe('AssetRMAListComponent', () => {
  let component: AssetRMAListComponent;
  let fixture: ComponentFixture<AssetRMAListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetRMAListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetRMAListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
