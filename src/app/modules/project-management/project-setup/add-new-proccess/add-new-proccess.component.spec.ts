import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewProccessComponent } from './add-new-proccess.component';

describe('AddNewProccessComponent', () => {
  let component: AddNewProccessComponent;
  let fixture: ComponentFixture<AddNewProccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddNewProccessComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddNewProccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
