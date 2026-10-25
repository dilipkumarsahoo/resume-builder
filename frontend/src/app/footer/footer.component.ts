import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  selectedLanguage = signal('English');
  langDropdownOpen = signal(false);

  languages = ['English', 'Español', 'Français', 'Deutsch'];

  toggleLangDropdown() {
    this.langDropdownOpen.update(v => !v);
  }

  setLanguage(lang: string) {
    this.selectedLanguage.set(lang);
    this.langDropdownOpen.set(false);
  }
}
