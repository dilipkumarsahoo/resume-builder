import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from './loader/loader.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { CvBuilderModalComponent } from './cv-builder-modal/cv-builder-modal.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    LoaderComponent,
    NavbarComponent,
    FooterComponent,
    CvBuilderModalComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
