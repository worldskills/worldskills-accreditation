import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneRequestAllocationAllocatedComponent } from './zone-request-allocation-allocated.component';

describe('ZoneRequestAllocationAllocatedComponent', () => {
  let component: ZoneRequestAllocationAllocatedComponent;
  let fixture: ComponentFixture<ZoneRequestAllocationAllocatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZoneRequestAllocationAllocatedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZoneRequestAllocationAllocatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
