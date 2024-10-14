import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeWrapperComponent } from './home-wrapper.component';

describe('HomeWrapperComponent', () => {
  let component: HomeWrapperComponent;
  let fixture: ComponentFixture<HomeWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeWrapperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
