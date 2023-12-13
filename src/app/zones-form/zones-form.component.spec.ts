import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZonesFormComponent } from './zones-form.component';

describe('ZonesFormComponent', () => {
  let component: ZonesFormComponent;
  let fixture: ComponentFixture<ZonesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZonesFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZonesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
