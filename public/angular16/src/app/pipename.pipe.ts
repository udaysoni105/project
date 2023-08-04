import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'json' })
export class JsonPipe implements PipeTransform {
  transform(value: any): string {
    if (value === null || value === undefined) {
      return 'N.A';
    }
    return JSON.stringify(value);
  }
}