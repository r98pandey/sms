import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TAndCUatComponent } from './t-and-c-uat.component';

describe('TAndCUatComponent', () => {
  let component: TAndCUatComponent;
  let fixture: ComponentFixture<TAndCUatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TAndCUatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TAndCUatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
