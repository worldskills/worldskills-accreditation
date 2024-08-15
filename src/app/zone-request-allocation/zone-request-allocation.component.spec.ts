import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneRequestAllocationComponent } from './zone-request-allocation.component';

describe('ZoneRequestAllocationComponent', () => {
  let component: ZoneRequestAllocationComponent;
  let fixture: ComponentFixture<ZoneRequestAllocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZoneRequestAllocationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZoneRequestAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
