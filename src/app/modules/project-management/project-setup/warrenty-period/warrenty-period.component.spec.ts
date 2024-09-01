import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarrentyPeriodComponent } from './warrenty-period.component';

describe('WarrentyPeriodComponent', () => {
  let component: WarrentyPeriodComponent;
  let fixture: ComponentFixture<WarrentyPeriodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WarrentyPeriodComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WarrentyPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
