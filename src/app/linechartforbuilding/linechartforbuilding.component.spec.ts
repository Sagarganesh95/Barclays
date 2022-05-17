import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinechartforbuildingComponent } from './linechartforbuilding.component';
import { MaterialModule } from '../adappt-material/material.module';
import { SharedModule } from '../shared/shared.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
describe('LinechartforbuildingComponent', () => {
  let component: LinechartforbuildingComponent;
  let fixture: ComponentFixture<LinechartforbuildingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule, HttpClientTestingModule
      ],
      declarations: [ LinechartforbuildingComponent ],
      providers: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinechartforbuildingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
