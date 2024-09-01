import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileListShownComponent } from './file-list-shown.component';

describe('FileListShownComponent', () => {
  let component: FileListShownComponent;
  let fixture: ComponentFixture<FileListShownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileListShownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileListShownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
