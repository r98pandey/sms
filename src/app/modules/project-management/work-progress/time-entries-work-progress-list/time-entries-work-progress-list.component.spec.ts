import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeEntriesWorkProgressListComponent } from './time-entries-work-progress-list.component';

describe('TimeEntriesWorkProgressListComponent', () => {
  let component: TimeEntriesWorkProgressListComponent;
  let fixture: ComponentFixture<TimeEntriesWorkProgressListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimeEntriesWorkProgressListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TimeEntriesWorkProgressListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
