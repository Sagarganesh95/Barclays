import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadercomComponent } from './loadercom.component';
import { MaterialModule } from '../adappt-material/material.module';

describe('LoadercomComponent', () => {
  let component: LoadercomComponent;
  let fixture: ComponentFixture<LoadercomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[ MaterialModule],
      declarations: [ LoadercomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadercomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
