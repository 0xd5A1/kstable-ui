import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinsDlgComponent } from './coins-dlg.component';

describe('CoinsDlgComponent', () => {
  let component: CoinsDlgComponent;
  let fixture: ComponentFixture<CoinsDlgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoinsDlgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoinsDlgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
