import { Component } from '@angular/core';
import { OptionEntity } from '../../interfaces/options';
import { Options } from '../../config/site-options';
import { CUR_YEAR } from '../../config/constants';
import { faCodeBranch, faEnvelope, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.less']
})
export class FooterComponent {
  options: OptionEntity = Options;
  curYear = CUR_YEAR;
  telegramIcon = faPaperPlane;
  emailIcon = faEnvelope;
  githubIcon = faCodeBranch;

  telegramUrl = Options.telegramUrl;
  email = Options.email;
  githubUrl = Options.githubUrl;
}
