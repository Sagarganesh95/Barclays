import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MaterialModule } from './adappt-material/material.module';
import { AdapptToolbarComponent } from './adappt-toolbar/adappt-toolbar.component';
import { WorkerService } from './worker.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from 'src/environments/environment.prod';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule, MaterialModule,HttpClientTestingModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
      ],
      declarations: [
        AppComponent, AdapptToolbarComponent
      ],
      providers: [NgxUiLoaderService, WorkerService]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'NOC App'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Network Operations Center - 1.28.0');
  });

  // it('should render title in a h1 tag', () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.debugElement.nativeElement;
  //   expect(compiled.querySelector('h1').textContent).toContain('Welcome to host-app!');
  // });
});
