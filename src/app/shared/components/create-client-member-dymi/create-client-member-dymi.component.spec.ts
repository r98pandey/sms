import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateClientMemberDymiComponent } from './create-client-member-dymi.component';

describe('CreateClientMemberDymiComponent', () => {
  let component: CreateClientMemberDymiComponent;
  let fixture: ComponentFixture<CreateClientMemberDymiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateClientMemberDymiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateClientMemberDymiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
