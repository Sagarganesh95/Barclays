import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdapptToolbarComponent } from './adappt-toolbar.component';
import { MaterialModule } from '../adappt-material/material.module';
import { SharedModule } from '../shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AdapptToolbarComponent', () => {
  let component: AdapptToolbarComponent;
  let fixture: ComponentFixture<AdapptToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
      ],
      declarations: [ AdapptToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdapptToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    let app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
