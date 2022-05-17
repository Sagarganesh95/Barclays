import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceTrackerComponent } from './service-tracker.component';
import { MaterialModule } from '../adappt-material/material.module';
import { AdapptDataTableComponent } from '../adappt-data-table/adappt-data-table.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ServiceTrackerComponent', () => {
  let component: ServiceTrackerComponent;
  let fixture: ComponentFixture<ServiceTrackerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ MaterialModule, RouterModule, FormsModule, ReactiveFormsModule, HttpClientTestingModule],
      declarations: [ ServiceTrackerComponent, AdapptDataTableComponent ],
      providers: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
