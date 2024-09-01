import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpDeskInternalDisscussionComponent } from './help-desk-internal-disscussion.component';

describe('HelpDeskInternalDisscussionComponent', () => {
  let component: HelpDeskInternalDisscussionComponent;
  let fixture: ComponentFixture<HelpDeskInternalDisscussionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpDeskInternalDisscussionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpDeskInternalDisscussionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
