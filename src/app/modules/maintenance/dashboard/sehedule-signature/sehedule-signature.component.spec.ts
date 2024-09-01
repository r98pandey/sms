import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeheduleSignatureComponent } from './sehedule-signature.component';

describe('SeheduleSignatureComponent', () => {
  let component: SeheduleSignatureComponent;
  let fixture: ComponentFixture<SeheduleSignatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeheduleSignatureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeheduleSignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
