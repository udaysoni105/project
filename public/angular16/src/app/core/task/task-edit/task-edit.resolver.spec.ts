import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { taskEditResolver } from './task-edit.resolver';

describe('taskEditResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => taskEditResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
