import {NgModule} from '@angular/core';
import {ReadingTimePipePipe} from './reading-time.pipe';
import {SafeHtmlPipe} from "./safe-html.pipe";

@NgModule({
  declarations: [ReadingTimePipePipe, SafeHtmlPipe],
  imports: [],
  exports: [ReadingTimePipePipe, SafeHtmlPipe]
})
export class PipesModule {
}
