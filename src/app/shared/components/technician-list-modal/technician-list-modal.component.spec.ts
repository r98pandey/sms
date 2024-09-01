import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicianListModalComponent } from './technician-list-modal.component';

describe('TechnicianListModalComponent', () => {
  let component: TechnicianListModalComponent;
  let fixture: ComponentFixture<TechnicianListModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TechnicianListModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TechnicianListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
