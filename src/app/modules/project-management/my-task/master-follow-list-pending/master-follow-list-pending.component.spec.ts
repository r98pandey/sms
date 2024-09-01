import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterFollowListPendingComponent } from './master-follow-list-pending.component';

describe('MasterFollowListPendingComponent', () => {
  let component: MasterFollowListPendingComponent;
  let fixture: ComponentFixture<MasterFollowListPendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MasterFollowListPendingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MasterFollowListPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
