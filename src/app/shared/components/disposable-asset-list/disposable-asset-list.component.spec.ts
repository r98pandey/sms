import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisposableAssetListComponent } from './disposable-asset-list.component';

describe('DisposableAssetListComponent', () => {
  let component: DisposableAssetListComponent;
  let fixture: ComponentFixture<DisposableAssetListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DisposableAssetListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DisposableAssetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
