import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowChartWithDigramComponent } from './flow-chart-with-digram.component';

describe('FlowChartWithDigramComponent', () => {
  let component: FlowChartWithDigramComponent;
  let fixture: ComponentFixture<FlowChartWithDigramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlowChartWithDigramComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlowChartWithDigramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
