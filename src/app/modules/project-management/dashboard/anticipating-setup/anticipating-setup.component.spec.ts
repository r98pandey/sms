import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnticipatingSetupComponent } from './anticipating-setup.component';

describe('AnticipatingSetupComponent', () => {
  let component: AnticipatingSetupComponent;
  let fixture: ComponentFixture<AnticipatingSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnticipatingSetupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnticipatingSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
