import { 
   Pipe, 
   PipeTransform 
} from '@angular/core';  

@Pipe ({ 
   name: 'toHHMMSS' 
}) 

export class TimeStrPipe implements PipeTransform { 
   transform(sec_num: number): string { 
      var hours   = Math.floor(sec_num / 3600);
      var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
      var seconds = sec_num - (hours * 3600) - (minutes * 60);

      var hourStr = hours.toString();
      var minuteStr = minutes.toString();
      var secondStr = seconds.toString();
      if (hours   < 10) {hourStr   = "0"+hourStr;}
      if (minutes < 10) {minuteStr = "0"+minuteStr;}
      if (seconds < 10) {secondStr = "0"+secondStr;}
      return hourStr+':'+minuteStr+':'+secondStr;
   }
}