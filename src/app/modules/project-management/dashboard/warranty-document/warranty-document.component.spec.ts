import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarrantyDocumentComponent } from './warranty-document.component';

describe('WarrantyDocumentComponent', () => {
  let component: WarrantyDocumentComponent;
  let fixture: ComponentFixture<WarrantyDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WarrantyDocumentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WarrantyDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
