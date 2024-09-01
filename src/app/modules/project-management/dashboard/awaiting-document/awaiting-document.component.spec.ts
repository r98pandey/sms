import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AwaitingDocumentComponent } from './awaiting-document.component';

describe('AwaitingDocumentComponent', () => {
  let component: AwaitingDocumentComponent;
  let fixture: ComponentFixture<AwaitingDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AwaitingDocumentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AwaitingDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
