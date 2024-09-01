import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmProspectListComponent } from './pm-prospect-list.component';

describe('PmProspectListComponent', () => {
  let component: PmProspectListComponent;
  let fixture: ComponentFixture<PmProspectListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PmProspectListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PmProspectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
