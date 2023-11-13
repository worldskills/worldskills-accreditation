import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ErrorComponent} from './error.component';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateServiceTestingProvider, TranslationMockPipe} from '../../test';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('ErrorComponent', () => {
  let component: ErrorComponent;
  let fixture: ComponentFixture<ErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorComponent, TranslationMockPipe],
      providers: [TranslateServiceTestingProvider],
      imports: [HttpClientTestingModule, RouterTestingModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
