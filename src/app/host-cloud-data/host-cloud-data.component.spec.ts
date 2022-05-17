import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HostCloudDataComponent } from './host-cloud-data.component';
import { MaterialModule } from '../adappt-material/material.module';
import { AmchartsComponent } from '../amcharts/amcharts.component';
import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { SiteDetailComponent } from '../site-detail/site-detail.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('HostCloudDataComponent', () => {
  let component: HostCloudDataComponent;
  let fixture: ComponentFixture<HostCloudDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ MaterialModule, SharedModule, HttpClientTestingModule],
      declarations: [ HostCloudDataComponent, DashboardComponent, SiteDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostCloudDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
