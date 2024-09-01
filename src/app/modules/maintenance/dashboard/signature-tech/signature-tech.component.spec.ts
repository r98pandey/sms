import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatureTechComponent } from './signature-tech.component';

describe('SignatureTechComponent', () => {
  let component: SignatureTechComponent;
  let fixture: ComponentFixture<SignatureTechComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignatureTechComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignatureTechComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
