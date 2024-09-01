import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEventFullDetailsComponent } from './view-event-full-details.component';

describe('ViewEventFullDetailsComponent', () => {
  let component: ViewEventFullDetailsComponent;
  let fixture: ComponentFixture<ViewEventFullDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewEventFullDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewEventFullDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
