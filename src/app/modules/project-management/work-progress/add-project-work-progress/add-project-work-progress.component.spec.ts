import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProjectWorkProgressComponent } from './add-project-work-progress.component';

describe('AddProjectWorkProgressComponent', () => {
  let component: AddProjectWorkProgressComponent;
  let fixture: ComponentFixture<AddProjectWorkProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddProjectWorkProgressComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddProjectWorkProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
