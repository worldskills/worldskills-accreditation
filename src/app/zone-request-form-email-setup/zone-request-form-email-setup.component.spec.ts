import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneRequestFormEmailSetupComponent } from './zone-request-form-email-setup.component';

describe('ZoneRequestFormEmailSetupComponent', () => {
  let component: ZoneRequestFormEmailSetupComponent;
  let fixture: ComponentFixture<ZoneRequestFormEmailSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZoneRequestFormEmailSetupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZoneRequestFormEmailSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
