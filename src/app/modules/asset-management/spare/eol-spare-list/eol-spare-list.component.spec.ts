import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EolSpareListComponent } from './eol-spare-list.component';

describe('EolSpareListComponent', () => {
  let component: EolSpareListComponent;
  let fixture: ComponentFixture<EolSpareListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EolSpareListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EolSpareListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
