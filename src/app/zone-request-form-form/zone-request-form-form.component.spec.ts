import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneRequestFormFormComponent } from './zone-request-form-form.component';

describe('ZoneRequestFormFormComponent', () => {
  let component: ZoneRequestFormFormComponent;
  let fixture: ComponentFixture<ZoneRequestFormFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZoneRequestFormFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZoneRequestFormFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
