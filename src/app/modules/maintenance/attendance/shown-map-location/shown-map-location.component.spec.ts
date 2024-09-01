import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShownMapLocationComponent } from './shown-map-location.component';

describe('ShownMapLocationComponent', () => {
  let component: ShownMapLocationComponent;
  let fixture: ComponentFixture<ShownMapLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShownMapLocationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShownMapLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
