import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CambiopassComponent } from './cambiopass.component';

describe('CambiopassComponent', () => {
  let component: CambiopassComponent;
  let fixture: ComponentFixture<CambiopassComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CambiopassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CambiopassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
