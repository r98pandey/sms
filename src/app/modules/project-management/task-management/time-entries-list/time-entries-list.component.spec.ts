import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeEntriesListComponent } from './time-entries-list.component';

describe('TimeEntriesListComponent', () => {
  let component: TimeEntriesListComponent;
  let fixture: ComponentFixture<TimeEntriesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimeEntriesListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TimeEntriesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
