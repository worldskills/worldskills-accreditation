import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneRequestAllocationPendingComponent } from './zone-request-allocation-pending.component';

describe('ZoneRequestAllocationPendingComponent', () => {
  let component: ZoneRequestAllocationPendingComponent;
  let fixture: ComponentFixture<ZoneRequestAllocationPendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZoneRequestAllocationPendingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZoneRequestAllocationPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
