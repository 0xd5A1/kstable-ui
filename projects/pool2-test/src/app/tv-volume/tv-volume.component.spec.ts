import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TvVolumeComponent } from './tv-volume.component';

describe('TvVolumeComponent', () => {
  let component: TvVolumeComponent;
  let fixture: ComponentFixture<TvVolumeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TvVolumeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TvVolumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
