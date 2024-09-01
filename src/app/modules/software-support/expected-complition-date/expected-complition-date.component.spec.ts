import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpectedComplitionDateComponent } from './expected-complition-date.component';

describe('ExpectedComplitionDateComponent', () => {
  let component: ExpectedComplitionDateComponent;
  let fixture: ComponentFixture<ExpectedComplitionDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpectedComplitionDateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpectedComplitionDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
