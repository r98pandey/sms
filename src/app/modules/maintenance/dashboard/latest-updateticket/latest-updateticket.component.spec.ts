import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestUpdateticketComponent } from './latest-updateticket.component';

describe('LatestUpdateticketComponent', () => {
  let component: LatestUpdateticketComponent;
  let fixture: ComponentFixture<LatestUpdateticketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LatestUpdateticketComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LatestUpdateticketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
