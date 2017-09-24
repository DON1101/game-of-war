import { 
   Pipe, 
   PipeTransform 
} from '@angular/core';  

@Pipe ({ 
   name: 'range' 
}) 

export class RangePipe implements PipeTransform { 
   transform(value: number[], limit: number): number[] { 
      for (var i = 0; i < limit; i++) {
          value.push(i);
      }
      return value;
   }
}