import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-info-section',
  standalone: true,
  imports: [NgIf],
  templateUrl: './info-section.component.html',
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({
        height: '0',
        overflow: 'hidden',
        opacity: '0',
        padding: '0'
      })),
      state('expanded', style({
        height: '*',
        opacity: '1'
      })),
      transition('expanded <=> collapsed', [
        animate('300ms ease-in-out')
      ])
    ])
  ]
})
export class InfoSectionComponent {
  @Input() showSection = true;
  @Input() canToggle = true;

  toggleSection(): void {
    if (this.canToggle) {
      this.showSection = !this.showSection;
    }
  }
}
