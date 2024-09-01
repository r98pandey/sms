import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMaintenanceAgreementModelComponent } from './add-maintenance-agreement-model.component';

describe('AddMaintenanceAgreementModelComponent', () => {
  let component: AddMaintenanceAgreementModelComponent;
  let fixture: ComponentFixture<AddMaintenanceAgreementModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddMaintenanceAgreementModelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddMaintenanceAgreementModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
