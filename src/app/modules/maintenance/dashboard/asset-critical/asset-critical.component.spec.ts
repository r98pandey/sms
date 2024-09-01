import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetCriticalComponent } from './asset-critical.component';

describe('AssetCriticalComponent', () => {
  let component: AssetCriticalComponent;
  let fixture: ComponentFixture<AssetCriticalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetCriticalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetCriticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
