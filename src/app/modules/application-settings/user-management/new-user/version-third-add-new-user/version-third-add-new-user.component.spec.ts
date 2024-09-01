import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionThirdAddNewUserComponent } from './version-third-add-new-user.component';

describe('VersionThirdAddNewUserComponent', () => {
  let component: VersionThirdAddNewUserComponent;
  let fixture: ComponentFixture<VersionThirdAddNewUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VersionThirdAddNewUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VersionThirdAddNewUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
