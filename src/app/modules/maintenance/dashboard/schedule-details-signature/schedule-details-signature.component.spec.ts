import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleDetailsSignatureComponent } from './schedule-details-signature.component';

describe('ScheduleDetailsSignatureComponent', () => {
  let component: ScheduleDetailsSignatureComponent;
  let fixture: ComponentFixture<ScheduleDetailsSignatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduleDetailsSignatureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleDetailsSignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
