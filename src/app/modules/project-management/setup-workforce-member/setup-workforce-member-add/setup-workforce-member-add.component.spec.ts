import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupWorkforceMemberAddComponent } from './setup-workforce-member-add.component';

describe('SetupWorkforceMemberAddComponent', () => {
  let component: SetupWorkforceMemberAddComponent;
  let fixture: ComponentFixture<SetupWorkforceMemberAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SetupWorkforceMemberAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SetupWorkforceMemberAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
