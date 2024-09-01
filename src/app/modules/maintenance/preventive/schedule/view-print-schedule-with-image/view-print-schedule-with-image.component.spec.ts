import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPrintScheduleWithImageComponent } from './view-print-schedule-with-image.component';

describe('ViewPrintScheduleWithImageComponent', () => {
  let component: ViewPrintScheduleWithImageComponent;
  let fixture: ComponentFixture<ViewPrintScheduleWithImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPrintScheduleWithImageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPrintScheduleWithImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
