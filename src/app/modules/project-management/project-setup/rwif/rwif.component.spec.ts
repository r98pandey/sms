import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RwifComponent } from './rwif.component';

describe('RwifComponent', () => {
  let component: RwifComponent;
  let fixture: ComponentFixture<RwifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RwifComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RwifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
