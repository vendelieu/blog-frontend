import { Component, HostListener, Input } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { faAnglesUp } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-scroll-top',
  templateUrl: './scroll-top.component.html',
  styleUrls: ['./scroll-top.component.less'],
  animations: [
    trigger('appearInOut', [
      state(
        'in',
        style({
          display: 'block',
          opacity: '1'
        })
      ),
      state(
        'out',
        style({
          display: 'none',
          opacity: '0'
        })
      ),
      transition('in <=> out', [style({ display: 'block' }), animate('400ms ease-in-out')])
    ])
  ]
})
export class ScrollTopComponent {
  animationState = 'out';
  scrollIcon = faAnglesUp;
  // Button will appear when user scrolls Y to this position, must be >=0
  @Input() scrollDistance = 50;
  // If true, scrolling to top will be animated
  @Input() animate = true;
  // Animated scrolling speed, must be >=1
  @Input() speed = 80;
  // Acceleration coefficient, added to speed when using animated scroll, must be >=0
  @Input() acceleration = 1;
  private timerID: any = null;

  /**
   * Listens to window scroll and animates the button
   */
  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.isBrowser()) {
      this.animationState = this.getCurrentScrollTop() > this.scrollDistance / 2 ? 'in' : 'out';
    }
  }

  /**
   * Scrolls window to top
   * @param event
   */
  scrollTop(event: any) {
    if (!this.isBrowser()) {
      return;
    }

    event.preventDefault();
    if (this.animate) {
      this.animateScrollTop();
    } else {
      window.scrollTo(0, 0);
    }
  }

  /**
   * Performs the animated scroll to top
   */
  animateScrollTop() {
    if (this.timerID !== null) {
      return;
    }

    let initialSpeed = this.speed;
    const that = this;
    this.timerID = setInterval(function () {
      window.scrollBy(0, -initialSpeed);
      initialSpeed = initialSpeed + that.acceleration;
      if (that.getCurrentScrollTop() === 0) {
        clearInterval(that.timerID);
        that.timerID = null;
      }
    }, 15);
  }

  /**
   * Get current Y scroll position
   * @returns {number}
   */
  getCurrentScrollTop() {
    if (typeof window.scrollY !== 'undefined' && window.scrollY >= 0) {
      return window.scrollY;
    }

    if (typeof window.pageYOffset !== 'undefined' && window.pageYOffset >= 0) {
      return window.pageYOffset;
    }

    if (typeof document.body.scrollTop !== 'undefined' && document.body.scrollTop >= 0) {
      return document.body.scrollTop;
    }

    if (typeof document.documentElement.scrollTop !== 'undefined' && document.documentElement.scrollTop >= 0) {
      return document.documentElement.scrollTop;
    }

    return 0;
  }

  /**
   * This check will prevent 'window' logic to be executed
   * while executing the server rendering
   * @returns {boolean}
   */
  isBrowser(): boolean {
    return typeof window !== 'undefined';
  }
}
