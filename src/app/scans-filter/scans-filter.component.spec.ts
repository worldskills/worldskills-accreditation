import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScansFilterComponent } from './scans-filter.component';

describe('ScansFilterComponent', () => {
  let component: ScansFilterComponent;
  let fixture: ComponentFixture<ScansFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScansFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScansFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
