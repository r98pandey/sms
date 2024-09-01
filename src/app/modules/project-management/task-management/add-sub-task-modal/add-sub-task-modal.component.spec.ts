import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubTaskModalComponent } from './add-sub-task-modal.component';

describe('AddSubTaskModalComponent', () => {
  let component: AddSubTaskModalComponent;
  let fixture: ComponentFixture<AddSubTaskModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddSubTaskModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddSubTaskModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
