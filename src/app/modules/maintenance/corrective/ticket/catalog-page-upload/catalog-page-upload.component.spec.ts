import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogPageUploadComponent } from './catalog-page-upload.component';

describe('CatalogPageUploadComponent', () => {
  let component: CatalogPageUploadComponent;
  let fixture: ComponentFixture<CatalogPageUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogPageUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogPageUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
