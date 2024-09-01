import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttmachmentAgreementComponent } from './attmachment-agreement.component';

describe('AttmachmentAgreementComponent', () => {
  let component: AttmachmentAgreementComponent;
  let fixture: ComponentFixture<AttmachmentAgreementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AttmachmentAgreementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AttmachmentAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
