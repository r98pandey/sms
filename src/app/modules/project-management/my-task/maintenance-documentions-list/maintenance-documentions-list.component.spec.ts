import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceDocumentionsListComponent } from './maintenance-documentions-list.component';

describe('MaintenanceDocumentionsListComponent', () => {
  let component: MaintenanceDocumentionsListComponent;
  let fixture: ComponentFixture<MaintenanceDocumentionsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaintenanceDocumentionsListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MaintenanceDocumentionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
