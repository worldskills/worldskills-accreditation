import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdhocPrintingComponent } from './adhoc-printing.component';

describe('AdhocPrintingComponent', () => {
  let component: AdhocPrintingComponent;
  let fixture: ComponentFixture<AdhocPrintingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdhocPrintingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdhocPrintingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
