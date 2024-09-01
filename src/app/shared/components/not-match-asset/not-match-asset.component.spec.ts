import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotMatchAssetComponent } from './not-match-asset.component';

describe('NotMatchAssetComponent', () => {
  let component: NotMatchAssetComponent;
  let fixture: ComponentFixture<NotMatchAssetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotMatchAssetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotMatchAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
