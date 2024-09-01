import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessModalWithRemarkComponent } from './success-modal-with-remark.component';

describe('SuccessModalWithRemarkComponent', () => {
  let component: SuccessModalWithRemarkComponent;
  let fixture: ComponentFixture<SuccessModalWithRemarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuccessModalWithRemarkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuccessModalWithRemarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
