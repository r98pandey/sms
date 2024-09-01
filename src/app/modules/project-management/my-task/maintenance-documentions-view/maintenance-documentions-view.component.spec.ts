import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceDocumentionsViewComponent } from './maintenance-documentions-view.component';

describe('MaintenanceDocumentionsViewComponent', () => {
  let component: MaintenanceDocumentionsViewComponent;
  let fixture: ComponentFixture<MaintenanceDocumentionsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaintenanceDocumentionsViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MaintenanceDocumentionsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
