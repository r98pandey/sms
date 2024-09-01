import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttmachmentAgreementWarrantyComponent } from './attmachment-agreement-warranty.component';

describe('AttmachmentAgreementWarrantyComponent', () => {
  let component: AttmachmentAgreementWarrantyComponent;
  let fixture: ComponentFixture<AttmachmentAgreementWarrantyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AttmachmentAgreementWarrantyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AttmachmentAgreementWarrantyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
