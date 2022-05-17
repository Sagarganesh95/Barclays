import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeskCloudDataComponent } from './desk-cloud-data.component';
import { MaterialModule } from '../adappt-material/material.module';
import { SharedModule } from '../shared/shared.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { SiteDetailComponent } from '../site-detail/site-detail.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from 'src/environments/environment.prod';

describe('DeskCloudDataComponent', () => {
  let component: DeskCloudDataComponent;
  let fixture: ComponentFixture<DeskCloudDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
        SharedModule,HttpClientTestingModule, ReactiveFormsModule, FormsModule
      ],
      declarations: [ DeskCloudDataComponent, DashboardComponent, SiteDetailComponent ],
      providers: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeskCloudDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
