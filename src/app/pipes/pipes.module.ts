import { NgModule } from '@angular/core';
import { NumberToStringPipe } from './number-to-string.pipe';
import { ReadingTimePipePipe } from './reading-time.pipe';

@NgModule({
  declarations: [NumberToStringPipe, ReadingTimePipePipe],
  imports: [],
  exports: [NumberToStringPipe, ReadingTimePipePipe]
})
export class PipesModule {}
