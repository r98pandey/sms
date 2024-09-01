import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DlpComponent } from './dlp.component';

describe('DlpComponent', () => {
  let component: DlpComponent;
  let fixture: ComponentFixture<DlpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DlpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DlpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
