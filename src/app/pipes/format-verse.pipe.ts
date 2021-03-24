import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatVerse'
})
export class FormatVersePipe implements PipeTransform {

  transform(value: string, ...args: any[]): string {
    if (value) {
      return value.replace(new RegExp(args[0], 'gi'), args[1]);
    }
  }
}
