import { TestBed } from '@angular/core/testing';

import { MixpanelService } from './mixpanel.service';

describe('MixpanelService', () => {
  let service: MixpanelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MixpanelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
