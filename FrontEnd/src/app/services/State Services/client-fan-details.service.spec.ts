import { TestBed } from '@angular/core/testing';

import { ClientFanDetailsService } from './client-fan-details.service';

describe('ClientFanDetailsService', () => {
  let service: ClientFanDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientFanDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
