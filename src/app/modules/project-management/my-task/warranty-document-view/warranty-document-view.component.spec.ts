import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarrantyDocumentViewComponent } from './warranty-document-view.component';

describe('WarrantyDocumentViewComponent', () => {
  let component: WarrantyDocumentViewComponent;
  let fixture: ComponentFixture<WarrantyDocumentViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WarrantyDocumentViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WarrantyDocumentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
