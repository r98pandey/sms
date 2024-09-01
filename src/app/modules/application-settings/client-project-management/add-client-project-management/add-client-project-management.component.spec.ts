import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddClientProjectManagementComponent } from './add-client-project-management.component';

describe('AddClientProjectManagementComponent', () => {
  let component: AddClientProjectManagementComponent;
  let fixture: ComponentFixture<AddClientProjectManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddClientProjectManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddClientProjectManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
