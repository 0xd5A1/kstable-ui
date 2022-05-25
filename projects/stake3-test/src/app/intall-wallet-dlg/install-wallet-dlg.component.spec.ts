import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallWalletDlgComponent } from './install-wallet-dlg.component';

describe('IntallWalletDlgComponent', () => {
  let component: InstallWalletDlgComponent;
  let fixture: ComponentFixture<InstallWalletDlgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstallWalletDlgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstallWalletDlgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
