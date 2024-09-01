import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceDocumentionsComponent } from './maintenance-documentions.component';

describe('MaintenanceDocumentionsComponent', () => {
  let component: MaintenanceDocumentionsComponent;
  let fixture: ComponentFixture<MaintenanceDocumentionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaintenanceDocumentionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MaintenanceDocumentionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
