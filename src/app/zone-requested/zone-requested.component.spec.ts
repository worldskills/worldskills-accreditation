import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneRequestedComponent } from './zone-requested.component';

describe('ZoneRequestedComponent', () => {
  let component: ZoneRequestedComponent;
  let fixture: ComponentFixture<ZoneRequestedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZoneRequestedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZoneRequestedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
