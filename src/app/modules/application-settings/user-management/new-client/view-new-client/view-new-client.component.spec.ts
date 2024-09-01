import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewNewClientComponent } from './view-new-client.component';

describe('ViewNewClientComponent', () => {
  let component: ViewNewClientComponent;
  let fixture: ComponentFixture<ViewNewClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewNewClientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewNewClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
