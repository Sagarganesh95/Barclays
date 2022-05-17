import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { AdapptTimelineDevicesComponent } from './adappt-timeline-devices.component';
import { MaterialModule } from '../adappt-material/material.module';
import { MatDialogRef, MatDialog, MatDialogModule } from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { OverlayContainer } from '@angular/cdk/overlay';

describe('AdapptTimelineDevicesComponent', () => {
  let component: AdapptTimelineDevicesComponent;
  let fixture: ComponentFixture<AdapptTimelineDevicesComponent>;
  let dialog: MatDialog;
  let overlayContainer: OverlayContainer;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ MaterialModule],
      declarations: [ AdapptTimelineDevicesComponent ],
      providers: [ ]
    })
    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [AdapptTimelineDevicesComponent]
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
    const dialogRef = dialog.open(AdapptTimelineDevicesComponent, {
      data: { param: '1' }
    });

    // verify
    expect(dialogRef.componentInstance instanceof AdapptTimelineDevicesComponent).toBe(true);
  });

  // beforeEach(() => {
  //   fixture = TestBed.createComponent(AdapptTimelineDevicesComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  // });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
