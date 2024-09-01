import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListNewClientComponent } from './list-new-client.component';

describe('ListNewClientComponent', () => {
  let component: ListNewClientComponent;
  let fixture: ComponentFixture<ListNewClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListNewClientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListNewClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
