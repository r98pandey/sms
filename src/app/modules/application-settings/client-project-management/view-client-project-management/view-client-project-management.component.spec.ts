import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewClientProjectManagementComponent } from './view-client-project-management.component';

describe('ViewClientProjectManagementComponent', () => {
  let component: ViewClientProjectManagementComponent;
  let fixture: ComponentFixture<ViewClientProjectManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewClientProjectManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewClientProjectManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
