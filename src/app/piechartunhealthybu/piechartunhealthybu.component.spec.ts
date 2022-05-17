import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PiechartunhealthybuComponent } from './piechartunhealthybu.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PiechartunhealthybuComponent', () => {
  let component: PiechartunhealthybuComponent;
  let fixture: ComponentFixture<PiechartunhealthybuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule],
      declarations: [ PiechartunhealthybuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PiechartunhealthybuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
