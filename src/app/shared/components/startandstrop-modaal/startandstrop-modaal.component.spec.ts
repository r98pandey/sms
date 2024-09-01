import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartandstropModaalComponent } from './startandstrop-modaal.component';

describe('StartandstropModaalComponent', () => {
  let component: StartandstropModaalComponent;
  let fixture: ComponentFixture<StartandstropModaalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StartandstropModaalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StartandstropModaalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
