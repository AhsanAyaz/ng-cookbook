import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailchimpNg2eComponent } from './mailchimp-ng2e.component';

describe('MailchimpNg2eComponent', () => {
  let component: MailchimpNg2eComponent;
  let fixture: ComponentFixture<MailchimpNg2eComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MailchimpNg2eComponent]
    });
    fixture = TestBed.createComponent(MailchimpNg2eComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
