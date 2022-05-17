import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmchartsComponent } from './amcharts.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../adappt-material/material.module';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { SiteDetailComponent } from '../site-detail/site-detail.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('AmchartsComponent', () => {
  let component: AmchartsComponent;
  let fixture: ComponentFixture<AmchartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ SharedModule, HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ DashboardComponent, SiteDetailComponent ],
      providers: [ ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmchartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
});
