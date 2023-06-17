import { Component } from '@angular/core';
import { Options } from '../../config/site-options';
import { faCodeBranch, faEnvelope, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.less']
})
export class FooterComponent {
  telegramIcon = faPaperPlane;
  emailIcon = faEnvelope;
  githubIcon = faCodeBranch;

  telegramUrl = Options.telegramUrl;
  email = Options.email;
  githubUrl = Options.githubUrl;
  protected readonly Options = Options;
}
