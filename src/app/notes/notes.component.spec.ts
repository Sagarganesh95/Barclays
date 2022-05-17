import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { NotesComponent } from './notes.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../adappt-material/material.module';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { MatDialog } from '@angular/material';
import { OverlayContainer } from '@angular/cdk/overlay';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('NotesComponent', () => {
  let component: NotesComponent;
  let fixture: ComponentFixture<NotesComponent>;
  let dialog: MatDialog;
  let overlayContainer: OverlayContainer;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [ FormsModule, ReactiveFormsModule, MaterialModule, HttpClientTestingModule],
      declarations: [ NotesComponent ]
    });
    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [NotesComponent]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(inject([MatDialog, OverlayContainer],
    (d: MatDialog, oc: OverlayContainer) => {
      dialog = d;
      overlayContainer = oc;
    })
  );

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('should open a dialog with a component', () => {
    const dialogRef = dialog.open(NotesComponent, {
      data: [{ param: '1' }]
    });

    // verify
    expect(dialogRef.componentInstance instanceof NotesComponent).toBe(true);
  });

  // beforeEach(() => {
  //   fixture = TestBed.createComponent(NotesComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  // });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
