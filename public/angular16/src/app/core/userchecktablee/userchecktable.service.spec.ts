import { TestBed } from '@angular/core/testing';

import { UserchecktableService } from './userchecktable.service';

describe('UserchecktableService', () => {
  let service: UserchecktableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserchecktableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
