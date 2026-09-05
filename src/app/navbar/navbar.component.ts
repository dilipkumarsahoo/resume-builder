import { Component, HostListener, inject, signal, OnInit, PLATFORM_ID, ChangeDetectorRef, ElementRef } from '@angular/core';
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
  private elementRef = inject(ElementRef);

  isScrolled = signal(false);
  mobileMenuOpen = signal(false);
  toolsDropdownOpen = signal(false);
  mobileToolsOpen = signal(false);

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.mobileMenuOpen.set(false);
      this.toolsDropdownOpen.set(false);
      if (isPlatformBrowser(this.platformId)) {
        this.isScrolled.set(window.scrollY > 15);
        this.cdr.markForCheck();
      }
    });

    if (isPlatformBrowser(this.platformId)) {
      this.isScrolled.set(window.scrollY > 15);
      this.cdr.markForCheck();
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (isPlatformBrowser(this.platformId)) {
      const scrolled = window.scrollY > 15;
      if (this.isScrolled() !== scrolled) {
        this.isScrolled.set(scrolled);
        this.cdr.markForCheck();
      }
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.toolsDropdownOpen() && !this.elementRef.nativeElement.contains(event.target)) {
      this.toolsDropdownOpen.set(false);
      this.cdr.markForCheck();
    }
  }

  toggleToolsDropdown(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.toolsDropdownOpen.update(v => !v);
  }

  openToolsDropdown() {
    this.toolsDropdownOpen.set(true);
  }

  closeToolsDropdown() {
    this.toolsDropdownOpen.set(false);
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
    this.toolsDropdownOpen.set(false);
    this.mobileToolsOpen.set(false);
  }

  toggleMobileTools() {
    this.mobileToolsOpen.update(v => !v);
  }

  openResumeTemplates() {
    this.closeMobileMenu();
    this.router.navigate(['/cover-letter'], { queryParams: { tab: 'resume' } });
  }

  openCoverLetter() {
    this.closeMobileMenu();
    this.router.navigate(['/cover-letter'], { queryParams: { tab: 'cover-letter' } });
  }

  openJobTracker() {
    this.closeMobileMenu();
    this.router.navigate(['/cover-letter'], { queryParams: { tab: 'jobs' } });
  }

  openGetStarted() {
    this.closeMobileMenu();
    this.cvService.openOnboarding();
  }
}
