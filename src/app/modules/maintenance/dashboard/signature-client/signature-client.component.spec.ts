import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatureClientComponent } from './signature-client.component';

describe('SignatureClientComponent', () => {
  let component: SignatureClientComponent;
  let fixture: ComponentFixture<SignatureClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignatureClientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignatureClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
