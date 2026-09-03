import { Component, HostListener, inject, signal, OnInit, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CvBuilderService } from '../cv-builder.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  cvService = inject(CvBuilderService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);

  isScrolled = signal(false);
  mobileMenuOpen = signal(false);

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.mobileMenuOpen.set(false);
      if (isPlatformBrowser(this.platformId)) {
        this.isScrolled.set(window.scrollY > 20);
        this.cdr.markForCheck();
      }
    });

    if (isPlatformBrowser(this.platformId)) {
      this.isScrolled.set(window.scrollY > 20);
      this.cdr.markForCheck();
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (isPlatformBrowser(this.platformId)) {
      const scrolled = window.scrollY > 20;
      if (this.isScrolled() !== scrolled) {
        this.isScrolled.set(scrolled);
        this.cdr.markForCheck();
      }
    }
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
  }

  openResumeBuilder() {
    this.closeMobileMenu();
    this.router.navigate(['/cover-letter'], { queryParams: { tab: 'resume' } });
  }

  openResumeTemplates() {
    this.closeMobileMenu();
    this.cvService.openResumeTemplates();
  }

  openCoverLetter() {
    this.closeMobileMenu();
    this.router.navigate(['/cover-letter']);
  }
}
