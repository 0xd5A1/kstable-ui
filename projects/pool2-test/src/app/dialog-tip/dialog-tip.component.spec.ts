import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogTipComponent } from './dialog-tip.component';

describe('DialogTipComponent', () => {
  let component: DialogTipComponent;
  let fixture: ComponentFixture<DialogTipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogTipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogTipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
