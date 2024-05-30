import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { ScrollTopComponent } from '../scroll-top/scroll-top.component';
import { SearchModalComponent } from '../search-modal/search-modal.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, ScrollTopComponent, RouterOutlet, SearchModalComponent],
  styleUrls: ['./layout.component.less']
})
export class LayoutComponent {
}
