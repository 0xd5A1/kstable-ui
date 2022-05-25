import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlippageSettingDlgComponent } from './slippage-setting-dlg.component';

describe('SlippageSettingDlgComponent', () => {
  let component: SlippageSettingDlgComponent;
  let fixture: ComponentFixture<SlippageSettingDlgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlippageSettingDlgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlippageSettingDlgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
