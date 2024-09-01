import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubTaskWorkProgressComponent } from './add-sub-task-work-progress.component';

describe('AddSubTaskWorkProgressComponent', () => {
  let component: AddSubTaskWorkProgressComponent;
  let fixture: ComponentFixture<AddSubTaskWorkProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddSubTaskWorkProgressComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddSubTaskWorkProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
