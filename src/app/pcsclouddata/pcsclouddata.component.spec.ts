import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PcsclouddataComponent } from './pcsclouddata.component';
import { MaterialModule } from '../adappt-material/material.module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { SiteDetailComponent } from '../site-detail/site-detail.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { WorkerService } from '../worker.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from 'src/environments/environment.prod';

describe('PcsclouddataComponent', () => {
  let component: PcsclouddataComponent;
  let fixture: ComponentFixture<PcsclouddataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ MaterialModule, SharedModule, FormsModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }), ReactiveFormsModule, HttpClientTestingModule],
      declarations: [ PcsclouddataComponent, DashboardComponent, SiteDetailComponent ],
      providers: [  WorkerService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PcsclouddataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
