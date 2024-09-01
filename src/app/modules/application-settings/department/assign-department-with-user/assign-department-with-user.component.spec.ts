import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignDepartmentWithUserComponent } from './assign-department-with-user.component';

describe('AssignDepartmentWithUserComponent', () => {
  let component: AssignDepartmentWithUserComponent;
  let fixture: ComponentFixture<AssignDepartmentWithUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignDepartmentWithUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignDepartmentWithUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
