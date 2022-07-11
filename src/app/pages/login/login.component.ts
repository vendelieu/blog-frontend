import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RESPONSE } from '@nguniversal/express-engine/tokens';
import { Response } from 'express';
import { uniq } from 'lodash';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from '../../components/message/message.service';
import { HTMLMetaData } from '../../interfaces/meta';
import { OptionEntity } from '../../interfaces/options';
import { AuthService } from '../../services/auth.service';
import { MetaService } from '../../core/meta.service';
import { ResponseCode } from '../../config/response-code.enum';
import { Options } from '../../config/site-options';

const margin = 24;
const offsets = [margin, 0, -margin, 0];
const duration = 500; // ms

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  animations: [
    trigger('shakeForm', [
      state('normal', style({})),
      state('shaking', style({})),

      transition('* => shaking', [
        animate(duration, keyframes(
          offsets.concat(offsets.concat(offsets)).map((offset) => style({ marginLeft: `${offset}px` }))
        ))
      ])
    ])
  ]
})
export class LoginComponent implements OnInit {
  loginForm = this.fb.group({
    username: [null, [Validators.required, Validators.maxLength(20)]],
    password: [null, [Validators.required, Validators.maxLength(20)]]
  });
  registerForm = this.fb.group({
    username: [null, [Validators.required, Validators.maxLength(20)]],
    email: [null, [Validators.required, Validators.email, Validators.maxLength(30)]],
    password: [null, [Validators.required, Validators.maxLength(20)]]
  });
  autoFocus = {
    username: true,
    password: false,
    email: false
  };
  formStatus: 'normal' | 'shaking' = 'normal';
  isRegisterMode = false;

  private redirectUrl = '';
  private options: OptionEntity = Options;

  constructor(
    private metaService: MetaService,
    private fb: FormBuilder,
    private cookieService: CookieService,
    private authService: AuthService,
    private message: MessageService,
    @Optional() @Inject(RESPONSE) protected response: Response
  ) {
  }

  ngOnInit(): void {
    this.initMeta();
  }

  turnRegisterMode() {
    this.isRegisterMode = !this.isRegisterMode;
  }

  checkForm(form: FormGroup, labels: Record<string, string>) {
    if (form.valid) return;
    this.shakeForm();

    const msgs: string[] = [];
    Object.keys(form.controls).forEach((key) => {
      const ctrl = form.get(key);
      const errors = ctrl?.errors;
      errors && Object.keys(errors).forEach((type) => {
        switch (type) {
          case 'required':
            msgs.push(`Please enter ${labels[key]}`);
            break;
          case 'maxlength':
            msgs.push(`${labels[key]} length should be no greater than ${errors[type].requiredLength} character, currently ${errors[type].actualLength}`);
            break;
        }
      });
    });
    msgs.length > 0 && this.message.error(msgs[0]);
  }

  login() {
    this.checkForm(this.loginForm, { username: 'Username', password: 'Password' });
    const { username, password } = this.loginForm.value;
    this.authService.login({
      username: username || '',
      password: password || ''
    }).subscribe((res) => {
      if (res?.code == ResponseCode.SUCCESS) {
        location.href = this.redirectUrl;
      } else {
        this.shakeForm();
      }
    });
  }

  register() {
    this.checkForm(this.registerForm, { username: 'Username', email: 'Email', password: 'Password' });
    const { username, email, password } = this.registerForm.value;
    this.authService.register({
      username: username || '',
      email: email || '',
      password: password || ''
    }).subscribe((res) => {
      if (res?.code == ResponseCode.SUCCESS) {
        this.isRegisterMode = false;
      } else {
        this.shakeForm();
      }
    });
  }

  private initMeta() {
    const titles = ['Login', this.options['site_name']];
    const keywords: string[] = (this.options['site_keywords'] || '').split(',');
    const metaData: HTMLMetaData = {
      title: titles.join(' - '),
      description: this.options['site_description'],
      author: this.options['site_author'],
      keywords: uniq(keywords).join(',')
    };
    this.metaService.updateHTMLMeta(metaData);
  }

  private shakeForm() {
    this.formStatus = 'shaking';
    setTimeout(() => this.formStatus = 'normal', duration);
  }
}
