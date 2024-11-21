import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoAppVideosComponent } from './demo-app-videos.component';

describe('DemoAppVideosComponent', () => {
  let component: DemoAppVideosComponent;
  let fixture: ComponentFixture<DemoAppVideosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemoAppVideosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemoAppVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
