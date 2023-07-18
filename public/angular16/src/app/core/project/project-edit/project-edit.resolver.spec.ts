import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { projectEditResolver } from './project-edit.resolver';

describe('projectEditResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => projectEditResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
