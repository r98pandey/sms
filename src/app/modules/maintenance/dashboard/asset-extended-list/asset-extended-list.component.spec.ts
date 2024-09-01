import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetExtendedListComponent } from './asset-extended-list.component';

describe('AssetExtendedListComponent', () => {
  let component: AssetExtendedListComponent;
  let fixture: ComponentFixture<AssetExtendedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetExtendedListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetExtendedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
