import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'readingTime'
})
export class ReadingTimePipePipe implements PipeTransform {
  transform(value: string) {
    let readingTimeMinutes = 1;

    if (value !== '') {
      // split text by spaces to define total words
      const totalWords = value.trim().split(/\s+/g).length;

      // define words per second based on words per minute (s.wordsPerMinute)
      // Read time is based on the average reading speed of an adult (roughly 265 WPM, Medium.com)
      // Wikipedia suggests a proofreading speed on screen of 180 words per minute (WPM)
      const wordsPerSecond = 180 / 60;

      // define total reading time in seconds
      const totalReadingTimeSeconds = totalWords / wordsPerSecond;

      // define reading time
      readingTimeMinutes = Math.floor(totalReadingTimeSeconds / 60);

      // return total reading time in minutes
      if (readingTimeMinutes >= 1) {
        return readingTimeMinutes;
      } else {
        // less than one minute read time
        return '< 1';
      }
    } else {
      return readingTimeMinutes;
    }
  }
}
