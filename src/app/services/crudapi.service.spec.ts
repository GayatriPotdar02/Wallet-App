import { TestBed } from '@angular/core/testing';

import { CrudapiService } from './crudapi.service';

describe('CrudapiService', () => {
  let service: CrudapiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrudapiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
