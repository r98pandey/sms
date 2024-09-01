import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewClientUserNavComponent } from './view-client-user-nav.component';

describe('ViewClientUserNavComponent', () => {
  let component: ViewClientUserNavComponent;
  let fixture: ComponentFixture<ViewClientUserNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewClientUserNavComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewClientUserNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
