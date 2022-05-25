import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StakeCompComponent } from './stake-comp.component';

describe('StakeCompComponent', () => {
  let component: StakeCompComponent;
  let fixture: ComponentFixture<StakeCompComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StakeCompComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StakeCompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
