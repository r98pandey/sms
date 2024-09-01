import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFollowComponent } from './add-follow.component';

describe('AddFollowComponent', () => {
  let component: AddFollowComponent;
  let fixture: ComponentFixture<AddFollowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddFollowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddFollowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
