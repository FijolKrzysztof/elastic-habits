import {Component, inject, Input} from '@angular/core';
import { NgIf } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import {AnalyticsService} from '../../../services/analytics.service';

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

  private readonly analytics = inject(AnalyticsService);

  toggleSection(): void {
    if (this.canToggle) {
      this.showSection = !this.showSection;
      this.analytics.event('info_section_toggled', {
        category: 'UI',
        new_state: this.showSection ? 'expanded' : 'collapsed',
        can_toggle: this.canToggle,
        timestamp: new Date().toISOString()
      });
    } else {
      this.analytics.event('info_section_toggle_blocked', {
        category: 'UI',
        current_state: this.showSection ? 'expanded' : 'collapsed',
        reason: 'toggle_disabled'
      });
    }
  }
}
