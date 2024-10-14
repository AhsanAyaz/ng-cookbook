import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPersonalComponent } from './landing-personal.component';

describe('LandingPersonalComponent', () => {
  let component: LandingPersonalComponent;
  let fixture: ComponentFixture<LandingPersonalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingPersonalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LandingPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
