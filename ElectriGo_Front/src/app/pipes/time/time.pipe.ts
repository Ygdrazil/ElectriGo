import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  transform(value: number): string {
    if(value == 0)
      return '';
    return `${Math.floor(value)}h ${Math.ceil((value - Math.floor(value)) * 60)}m`;
  }

}
