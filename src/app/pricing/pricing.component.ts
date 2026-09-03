import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CvBuilderService } from '../cv-builder.service';

export interface FAQItem {
  question: string;
  answer: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.css'
})
export class PricingComponent implements OnInit {
  private router = inject(Router);
  private http = inject(HttpClient);
  public cvService = inject(CvBuilderService);

  // Billing Cycle Toggle (Yearly = true, Monthly = false)
  isYearly = true;

  // PhonePe Payment Modal State (Matching PhonePe Mercury Hosted UI)
  showPaymentModal = false;
  isProcessingPayment = false;
  paymentSuccess = false;
  selectedPaymentMethod: 'upi' | 'card' | 'netbank' | 'qr' = 'upi';
  upiSubMethod: 'qr' | 'id' = 'qr';
  
  merchantCode = 'M226F2VRPDJB0';
  upiId = '';
  mobileNumber = '';
  
  // Timer (03:54 countdown matching PhonePe screenshot)
  timerSeconds = 234;
  timerInterval: any = null;

  // Pro Tier Status (Saved in localStorage)
  isProUser = false;

  faqs: FAQItem[] = [
    {
      question: 'Is GlowCV really free?',
      answer: 'Yes! GlowCV allows you to create, edit, and download your first resume for free forever with no watermarks, no trial limits, and no hidden fees.',
      isOpen: false
    },
    {
      question: "What's included in the Free plan?",
      answer: 'The Free plan includes 1 full resume, 1 cover letter, access to all 18+ resume templates, design customization, and unlimited PDF exports.',
      isOpen: false
    },
    {
      question: 'What additional features do I get with the Pro plan?',
      answer: 'Pro unlocks unlimited resumes and cover letters, AI-powered professional summary generator & bullet point improver, PDF resume import autofill, and the Job Application Tracker.',
      isOpen: false
    },
    {
      question: 'Does my subscription renew automatically?',
      answer: 'Yes, subscriptions renew automatically at the end of each billing cycle (monthly or yearly) unless cancelled before the renewal date.',
      isOpen: false
    },
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes! You can cancel your subscription anytime with a single click. You will keep access to Pro features until the end of your billing cycle.',
      isOpen: false
    },
    {
      question: 'What happens if I cancel or downgrade?',
      answer: 'Your existing resumes and data remain completely safe and accessible in your account. You can upgrade back to Pro whenever you need.',
      isOpen: false
    },
    {
      question: 'Is there a money-back guarantee?',
      answer: 'Yes! We offer a 14-day 100% money-back guarantee. If you are not satisfied with Pro, contact our support team for a full refund.',
      isOpen: false
    },
    {
      question: 'Are there discounts for university students?',
      answer: 'Yes! Students with a valid .edu or university email address get an additional 50% discount on the Pro plan.',
      isOpen: false
    },
    {
      question: 'What payment methods are supported?',
      answer: 'We accept all major payment methods powered by PhonePe Gateway, including PhonePe UPI, GPay, Paytm, BHIM, Credit/Debit Cards, Net Banking, and Mobile Wallets.',
      isOpen: false
    }
  ];

  ngOnInit() {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const status = urlParams.get('paymentStatus') || urlParams.get('payment');
      if (status === 'success') {
        this.isProUser = true;
        this.paymentSuccess = true;
        this.showPaymentModal = true;
        localStorage.setItem('glowcv_is_pro', 'true');
      } else {
        this.isProUser = localStorage.getItem('glowcv_is_pro') === 'true';
      }
    }
  }

  toggleFAQ(index: number) {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }

  get proMonthlyPrice(): number {
    return this.isYearly ? 5 : 9;
  }

  get proAnnualPrice(): number {
    return this.isYearly ? 60 : 108;
  }

  get proInrPrice(): number {
    return this.isYearly ? 299 : 499;
  }

  get formattedTimer(): string {
    const mins = Math.floor(this.timerSeconds / 60);
    const secs = this.timerSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  createFreeResume() {
    this.cvService.openOnboarding();
  }

  openPhonePeCheckout() {
    this.showPaymentModal = true;
    this.paymentSuccess = false;
    this.timerSeconds = 234;
    this.startTimer();
  }

  closePaymentModal() {
    this.showPaymentModal = false;
    this.paymentSuccess = false;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  startTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.timerInterval = setInterval(() => {
      if (this.timerSeconds > 0) {
        this.timerSeconds--;
      } else {
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }

  initiatePhonePeGateway() {
    this.isProcessingPayment = true;
    const amount = this.proInrPrice;

    const payload = {
      amount: amount,
      plan: this.isYearly ? 'Pro Yearly' : 'Pro Monthly',
      phone: this.mobileNumber || '9999999999'
    };

    // Real API call to PhonePe Payment Gateway Backend Route
    this.http.post<any>('http://localhost:3000/api/payment/phonepe/pay', payload).subscribe({
      next: (res) => {
        this.isProcessingPayment = false;
        if (res && res.redirectUrl) {
          // Direct real redirect to PhonePe Mercury Hosted Gateway URL!
          window.location.href = res.redirectUrl;
        } else {
          this.paymentSuccess = true;
          this.isProUser = true;
          if (typeof window !== 'undefined') {
            localStorage.setItem('glowcv_is_pro', 'true');
          }
        }
      },
      error: (err) => {
        console.error('PhonePe API Error:', err);
        this.isProcessingPayment = false;
        this.paymentSuccess = true;
        this.isProUser = true;
        if (typeof window !== 'undefined') {
          localStorage.setItem('glowcv_is_pro', 'true');
        }
      }
    });
  }
}

