import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListClientProjectManagementComponent } from './list-client-project-management.component';

describe('ListClientProjectManagementComponent', () => {
  let component: ListClientProjectManagementComponent;
  let fixture: ComponentFixture<ListClientProjectManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListClientProjectManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListClientProjectManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
