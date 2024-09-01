import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarrantyDocumentListComponent } from './warranty-document-list.component';

describe('WarrantyDocumentListComponent', () => {
  let component: WarrantyDocumentListComponent;
  let fixture: ComponentFixture<WarrantyDocumentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WarrantyDocumentListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WarrantyDocumentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
