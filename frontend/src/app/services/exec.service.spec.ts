import { TestBed, inject } from '@angular/core/testing';

import { ExecService } from './exec.service';

describe('ExecService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExecService]
    });
  });

  it('should be created', inject([ExecService], (service: ExecService) => {
    expect(service).toBeTruthy();
  }));
});
