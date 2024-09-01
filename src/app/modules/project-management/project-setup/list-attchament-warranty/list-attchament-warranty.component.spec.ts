import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAttchamentWarrantyComponent } from './list-attchament-warranty.component';

describe('AddAttchamentWarrantyComponent', () => {
  let component: AddAttchamentWarrantyComponent;
  let fixture: ComponentFixture<AddAttchamentWarrantyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddAttchamentWarrantyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddAttchamentWarrantyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
