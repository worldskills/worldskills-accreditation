import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneRequestFormComponent } from './zone-request-form.component';

describe('ZoneRequestFormComponent', () => {
  let component: ZoneRequestFormComponent;
  let fixture: ComponentFixture<ZoneRequestFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZoneRequestFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZoneRequestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
