import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InServiceSpareComponent } from './in-service-spare.component';

describe('InServiceSpareComponent', () => {
  let component: InServiceSpareComponent;
  let fixture: ComponentFixture<InServiceSpareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InServiceSpareComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InServiceSpareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
