import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateRFWIFormComponent } from './generate-rfwiform.component';

describe('GenerateRFWIFormComponent', () => {
  let component: GenerateRFWIFormComponent;
  let fixture: ComponentFixture<GenerateRFWIFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GenerateRFWIFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GenerateRFWIFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
