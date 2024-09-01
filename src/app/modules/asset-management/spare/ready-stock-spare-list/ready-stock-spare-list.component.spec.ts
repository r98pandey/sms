import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadyStockSpareListComponent } from './ready-stock-spare-list.component';

describe('ReadyStockSpareListComponent', () => {
  let component: ReadyStockSpareListComponent;
  let fixture: ComponentFixture<ReadyStockSpareListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadyStockSpareListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadyStockSpareListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
