import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRwifFormComponent } from './edit-rwif-form.component';

describe('EditRwifFormComponent', () => {
  let component: EditRwifFormComponent;
  let fixture: ComponentFixture<EditRwifFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditRwifFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditRwifFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
