import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditNewUserComponent } from './edit-new-user.component';

describe('EditNewUserComponent', () => {
  let component: EditNewUserComponent;
  let fixture: ComponentFixture<EditNewUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditNewUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditNewUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
