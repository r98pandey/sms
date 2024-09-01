import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupWorkforceMemberListComponent } from './setup-workforce-member-list.component';

describe('SetupWorkforceMemberListComponent', () => {
  let component: SetupWorkforceMemberListComponent;
  let fixture: ComponentFixture<SetupWorkforceMemberListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SetupWorkforceMemberListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SetupWorkforceMemberListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
