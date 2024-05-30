import { Component } from '@angular/core';
import { Options } from '../../config/site-options';
import { faCodeBranch, faEnvelope, faHeart, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.less'],
  imports: [FontAwesomeModule],
  standalone: true
})
export class FooterComponent {
  telegramIcon = faPaperPlane;
  emailIcon = faEnvelope;
  githubIcon = faCodeBranch;
  heartIcon = faHeart;
  protected readonly Options = Options;
}
