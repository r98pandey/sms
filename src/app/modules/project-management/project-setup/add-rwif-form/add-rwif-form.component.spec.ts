import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRwifFormComponent } from './add-rwif-form.component';

describe('AddRwifFormComponent', () => {
  let component: AddRwifFormComponent;
  let fixture: ComponentFixture<AddRwifFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddRwifFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddRwifFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
