import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetPaidToPayComponent } from './get-paid-to-pay.component';

describe('GetPaidToPayComponent', () => {
  let component: GetPaidToPayComponent;
  let fixture: ComponentFixture<GetPaidToPayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetPaidToPayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetPaidToPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
