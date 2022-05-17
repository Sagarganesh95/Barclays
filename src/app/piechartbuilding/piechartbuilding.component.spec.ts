import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PiechartbuildingComponent } from './piechartbuilding.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PiechartbuildingComponent', () => {
  let component: PiechartbuildingComponent;
  let fixture: ComponentFixture<PiechartbuildingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule],
      declarations: [ PiechartbuildingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PiechartbuildingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
