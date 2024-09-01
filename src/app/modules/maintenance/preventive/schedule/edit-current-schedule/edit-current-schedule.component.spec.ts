import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCurrentScheduleComponent } from './edit-current-schedule.component';

describe('EditCurrentScheduleComponent', () => {
  let component: EditCurrentScheduleComponent;
  let fixture: ComponentFixture<EditCurrentScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCurrentScheduleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditCurrentScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
