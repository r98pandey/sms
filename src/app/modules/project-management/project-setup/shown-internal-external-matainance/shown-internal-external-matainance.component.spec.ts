import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShownInternalExternalMatainanceComponent } from './shown-internal-external-matainance.component';

describe('ShownInternalExternalMatainanceComponent', () => {
  let component: ShownInternalExternalMatainanceComponent;
  let fixture: ComponentFixture<ShownInternalExternalMatainanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShownInternalExternalMatainanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShownInternalExternalMatainanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
