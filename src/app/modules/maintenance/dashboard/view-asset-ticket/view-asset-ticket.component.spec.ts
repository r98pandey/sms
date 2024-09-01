import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAssetTicketComponent } from './view-asset-ticket.component';

describe('ViewAssetTicketComponent', () => {
  let component: ViewAssetTicketComponent;
  let fixture: ComponentFixture<ViewAssetTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAssetTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAssetTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
