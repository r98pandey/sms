import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MytaskAccessRightModalInternalExternalMatainanceComponent } from './mytask-access-right-modal-internal-external-matainance.component';

describe('MytaskAccessRightModalInternalExternalMatainanceComponent', () => {
  let component: MytaskAccessRightModalInternalExternalMatainanceComponent;
  let fixture: ComponentFixture<MytaskAccessRightModalInternalExternalMatainanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MytaskAccessRightModalInternalExternalMatainanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MytaskAccessRightModalInternalExternalMatainanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
