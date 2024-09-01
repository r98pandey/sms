import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewGetV2UserListApplicationComponent } from './new-get-v2-user-list-application.component';

describe('NewGetV2UserListApplicationComponent', () => {
  let component: NewGetV2UserListApplicationComponent;
  let fixture: ComponentFixture<NewGetV2UserListApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewGetV2UserListApplicationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewGetV2UserListApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
