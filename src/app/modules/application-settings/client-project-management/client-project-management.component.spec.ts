import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientProjectManagementComponent } from './client-project-management.component';

describe('ClientProjectManagementComponent', () => {
  let component: ClientProjectManagementComponent;
  let fixture: ComponentFixture<ClientProjectManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientProjectManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientProjectManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
