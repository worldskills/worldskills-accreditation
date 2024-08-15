import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneRequestAllocationFinderComponent } from './zone-request-allocation-finder.component';

describe('ZoneRequestAllocationFinderComponent', () => {
  let component: ZoneRequestAllocationFinderComponent;
  let fixture: ComponentFixture<ZoneRequestAllocationFinderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZoneRequestAllocationFinderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZoneRequestAllocationFinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
