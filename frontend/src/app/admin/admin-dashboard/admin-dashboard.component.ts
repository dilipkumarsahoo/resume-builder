import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AdminService, AdminStats, AdminUser, AdminPayment, AdminContact } from '../../services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  public adminService = inject(AdminService);
  private router = inject(Router);

  // Active View Tab
  currentTab = signal<'overview' | 'users' | 'payments' | 'contacts' | 'settings'>('overview');

  // Loading States
  isLoadingStats = signal<boolean>(false);
  isLoadingUsers = signal<boolean>(false);
  isLoadingPayments = signal<boolean>(false);
  isLoadingContacts = signal<boolean>(false);
  actionFeedback = signal<string | null>(null);

  // Stats Data
  stats = signal<AdminStats | null>(null);

  // Users Data & Filters
  users = signal<AdminUser[]>([]);
  userSearch = '';
  userProFilter = '';
  userPage = 1;
  userTotalPages = 1;
  userTotalCount = 0;

  // Payments Data & Filters
  payments = signal<AdminPayment[]>([]);
  paymentStatusFilter = 'ALL';
  paymentPage = 1;
  paymentTotalPages = 1;
  paymentTotalCount = 0;

  // Contact Messages Data & Filters
  contacts = signal<AdminContact[]>([]);
  contactStatusFilter = 'ALL';
  contactPage = 1;
  contactTotalPages = 1;
  contactTotalCount = 0;
  selectedContact = signal<AdminContact | null>(null);
  contactToDelete = signal<AdminContact | null>(null);
  isDeletingContact = signal<boolean>(false);

  // User Deletion Modal
  userToDelete = signal<AdminUser | null>(null);
  isDeletingUser = signal<boolean>(false);

  // Copy Feedback
  copiedId = signal<string | null>(null);

  ngOnInit() {
    this.loadStats();
    this.loadUsers();
    this.loadPayments();
    this.loadContacts();
  }

  setTab(tab: 'overview' | 'users' | 'payments' | 'contacts' | 'settings') {
    this.currentTab.set(tab);
    if (tab === 'overview') this.loadStats();
    if (tab === 'users') this.loadUsers();
    if (tab === 'payments') this.loadPayments();
    if (tab === 'contacts') this.loadContacts();
  }

  loadStats() {
    this.isLoadingStats.set(true);
    this.adminService.getStats().subscribe({
      next: (res) => {
        this.isLoadingStats.set(false);
        if (res?.data) {
          this.stats.set(res.data);
        }
      },
      error: (err) => {
        this.isLoadingStats.set(false);
        console.error('Failed to load stats:', err);
      }
    });
  }

  loadUsers() {
    this.isLoadingUsers.set(true);
    this.adminService.getUsers({
      search: this.userSearch,
      isPro: this.userProFilter,
      page: this.userPage,
      limit: 15
    }).subscribe({
      next: (res) => {
        this.isLoadingUsers.set(false);
        if (res?.data?.users) {
          this.users.set(res.data.users);
          this.userTotalCount = res.data.pagination.total;
          this.userTotalPages = res.data.pagination.totalPages || 1;
        }
      },
      error: (err) => {
        this.isLoadingUsers.set(false);
        console.error('Failed to load users:', err);
      }
    });
  }

  onUserSearch() {
    this.userPage = 1;
    this.loadUsers();
  }

  onProFilterChange(filter: string) {
    this.userProFilter = filter;
    this.userPage = 1;
    this.loadUsers();
  }

  nextUserPage() {
    if (this.userPage < this.userTotalPages) {
      this.userPage++;
      this.loadUsers();
    }
  }

  prevUserPage() {
    if (this.userPage > 1) {
      this.userPage--;
      this.loadUsers();
    }
  }

  toggleProStatus(user: AdminUser) {
    this.adminService.toggleUserPro(user.id).subscribe({
      next: (res) => {
        this.showToast(`Updated ${user.email} to ${res.data.isPro ? 'PRO' : 'FREE'}`);
        this.users.update(list =>
          list.map(u => u.id === user.id ? { ...u, isPro: res.data.isPro } : u)
        );
        this.loadStats();
      },
      error: (err) => {
        this.showToast('Failed to update user Pro status');
        console.error(err);
      }
    });
  }

  confirmDeleteUser(user: AdminUser) {
    this.userToDelete.set(user);
  }

  cancelDelete() {
    this.userToDelete.set(null);
  }

  executeDeleteUser() {
    const user = this.userToDelete();
    if (!user) return;

    this.isDeletingUser.set(true);
    this.adminService.deleteUser(user.id).subscribe({
      next: () => {
        this.isDeletingUser.set(false);
        this.userToDelete.set(null);
        this.showToast(`User ${user.email} deleted successfully`);
        this.loadUsers();
        this.loadStats();
      },
      error: (err) => {
        this.isDeletingUser.set(false);
        this.showToast('Failed to delete user');
        console.error(err);
      }
    });
  }

  loadPayments() {
    this.isLoadingPayments.set(true);
    this.adminService.getPayments({
      status: this.paymentStatusFilter,
      page: this.paymentPage,
      limit: 15
    }).subscribe({
      next: (res) => {
        this.isLoadingPayments.set(false);
        if (res?.data?.payments) {
          this.payments.set(res.data.payments);
          this.paymentTotalCount = res.data.pagination.total;
          this.paymentTotalPages = res.data.pagination.totalPages || 1;
        }
      },
      error: (err) => {
        this.isLoadingPayments.set(false);
        console.error('Failed to load payments:', err);
      }
    });
  }

  onPaymentStatusChange(status: string) {
    this.paymentStatusFilter = status;
    this.paymentPage = 1;
    this.loadPayments();
  }

  nextPaymentPage() {
    if (this.paymentPage < this.paymentTotalPages) {
      this.paymentPage++;
      this.loadPayments();
    }
  }

  prevPaymentPage() {
    if (this.paymentPage > 1) {
      this.paymentPage--;
      this.loadPayments();
    }
  }

  // Contact Inquiries Methods
  loadContacts() {
    this.isLoadingContacts.set(true);
    this.adminService.getContacts({
      status: this.contactStatusFilter,
      page: this.contactPage,
      limit: 15
    }).subscribe({
      next: (res) => {
        this.isLoadingContacts.set(false);
        if (res?.data?.messages) {
          this.contacts.set(res.data.messages);
          this.contactTotalCount = res.data.pagination.total;
          this.contactTotalPages = res.data.pagination.totalPages || 1;
        }
      },
      error: (err) => {
        this.isLoadingContacts.set(false);
        console.error('Failed to load contacts:', err);
      }
    });
  }

  onContactStatusChange(status: string) {
    this.contactStatusFilter = status;
    this.contactPage = 1;
    this.loadContacts();
  }

  nextContactPage() {
    if (this.contactPage < this.contactTotalPages) {
      this.contactPage++;
      this.loadContacts();
    }
  }

  prevContactPage() {
    if (this.contactPage > 1) {
      this.contactPage--;
      this.loadContacts();
    }
  }

  openContactModal(contact: AdminContact) {
    this.selectedContact.set(contact);
    if (contact.status === 'UNREAD') {
      this.updateContactStatus(contact.id, 'READ');
    }
  }

  closeContactModal() {
    this.selectedContact.set(null);
  }

  updateContactStatus(id: number, status: 'UNREAD' | 'READ' | 'REPLIED') {
    this.adminService.updateContactStatus(id, status).subscribe({
      next: (res) => {
        this.contacts.update(list =>
          list.map(c => c.id === id ? { ...c, status } : c)
        );
        if (this.selectedContact()?.id === id) {
          this.selectedContact.update(c => c ? { ...c, status } : null);
        }
        this.showToast(`Message marked as ${status}`);
        this.loadStats();
      },
      error: (err) => {
        this.showToast('Failed to update status');
        console.error(err);
      }
    });
  }

  confirmDeleteContact(contact: AdminContact) {
    this.contactToDelete.set(contact);
  }

  cancelDeleteContact() {
    this.contactToDelete.set(null);
  }

  executeDeleteContact() {
    const contact = this.contactToDelete();
    if (!contact) return;

    this.isDeletingContact.set(true);
    this.adminService.deleteContact(contact.id).subscribe({
      next: () => {
        this.isDeletingContact.set(false);
        this.contactToDelete.set(null);
        if (this.selectedContact()?.id === contact.id) {
          this.selectedContact.set(null);
        }
        this.showToast('Contact message deleted successfully');
        this.loadContacts();
        this.loadStats();
      },
      error: (err) => {
        this.isDeletingContact.set(false);
        this.showToast('Failed to delete contact message');
        console.error(err);
      }
    });
  }

  copyToClipboard(text: string) {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      this.copiedId.set(text);
      setTimeout(() => {
        this.copiedId.set(null);
      }, 2000);
    }
  }

  showToast(message: string) {
    this.actionFeedback.set(message);
    setTimeout(() => {
      this.actionFeedback.set(null);
    }, 3500);
  }

  logout() {
    this.adminService.logout();
  }
}
