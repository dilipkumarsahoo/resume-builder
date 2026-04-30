import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CvBuilderService, CVData } from './cv-builder.service';

@Component({
  selector: 'app-cv-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-full overflow-y-auto p-6 bg-white no-scrollbar">
      <h2 class="text-2xl font-bold text-text-main mb-6">Personal Details</h2>
      
      <div class="space-y-4 mb-8">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" [ngModel]="data().fullName" (ngModelChange)="updateField('fullName', $event)"
                   class="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
            <input type="text" [ngModel]="data().jobTitle" (ngModelChange)="updateField('jobTitle', $event)"
                   class="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all">
          </div>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" [ngModel]="data().email" (ngModelChange)="updateField('email', $event)"
                   class="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input type="text" [ngModel]="data().phone" (ngModelChange)="updateField('phone', $event)"
                   class="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all">
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input type="text" [ngModel]="data().location" (ngModelChange)="updateField('location', $event)"
                 class="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all">
        </div>
      </div>

      <h2 class="text-2xl font-bold text-text-main mb-6">Professional Summary</h2>
      <div class="mb-8 relative">
        <textarea [ngModel]="data().summary" (ngModelChange)="updateField('summary', $event)" rows="4"
                  class="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all resize-none"></textarea>
        <button (click)="cvService.improveSummary()" [disabled]="cvService.isImprovingSummary()" class="absolute bottom-3 right-3 text-accent hover:text-emerald-600 flex items-center gap-1 text-sm font-medium bg-white px-2 py-1 rounded shadow-sm border border-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
          @if (cvService.isImprovingSummary()) {
            <span class="material-icons text-sm animate-spin">refresh</span> Improving...
          } @else {
            <span class="material-icons text-sm">auto_awesome</span> Improve
          }
        </button>
      </div>

      <h2 class="text-2xl font-bold text-text-main mb-6">Skills</h2>
      <div class="mb-8">
        <div class="flex flex-wrap gap-2 mb-3">
          @for (skill of data().skills; track skill; let i = $index) {
            <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-bg-light text-sm text-gray-700 border border-gray-200">
              {{ skill }}
              <button (click)="removeSkill(i)" class="text-gray-400 hover:text-red-500 focus:outline-none">
                <span class="material-icons text-sm">close</span>
              </button>
            </span>
          }
        </div>
        <div class="flex gap-2">
          <input #newSkill type="text" placeholder="Add a skill..." (keydown.enter)="addSkill(newSkill.value); newSkill.value = ''"
                 class="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all">
          <button (click)="addSkill(newSkill.value); newSkill.value = ''" class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors">
            Add
          </button>
        </div>
      </div>

      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-text-main">Experience</h2>
        <button (click)="addExperience()" class="text-accent hover:text-emerald-600 flex items-center gap-1 text-sm font-medium">
          <span class="material-icons text-sm">add</span> Add Role
        </button>
      </div>
      
      <div class="space-y-6 mb-8">
        @for (exp of data().experience; track exp.id; let i = $index) {
          <div class="p-4 rounded-xl border border-gray-200 bg-gray-50/50 relative group">
            <button (click)="removeExperience(i)" class="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
              <span class="material-icons">delete_outline</span>
            </button>
            
            <div class="grid grid-cols-2 gap-4 mb-4 pr-8">
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">Company</label>
                <input type="text" [ngModel]="exp.company" (ngModelChange)="updateExperience(i, 'company', $event)"
                       class="w-full px-3 py-1.5 text-sm rounded-md border border-gray-200 focus:border-accent outline-none">
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">Role</label>
                <input type="text" [ngModel]="exp.role" (ngModelChange)="updateExperience(i, 'role', $event)"
                       class="w-full px-3 py-1.5 text-sm rounded-md border border-gray-200 focus:border-accent outline-none">
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">Start Date</label>
                <input type="text" [ngModel]="exp.startDate" (ngModelChange)="updateExperience(i, 'startDate', $event)"
                       class="w-full px-3 py-1.5 text-sm rounded-md border border-gray-200 focus:border-accent outline-none">
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">End Date</label>
                <input type="text" [ngModel]="exp.endDate" (ngModelChange)="updateExperience(i, 'endDate', $event)"
                       class="w-full px-3 py-1.5 text-sm rounded-md border border-gray-200 focus:border-accent outline-none">
              </div>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">Description</label>
              <textarea [ngModel]="exp.description" (ngModelChange)="updateExperience(i, 'description', $event)" rows="3"
                        class="w-full px-3 py-1.5 text-sm rounded-md border border-gray-200 focus:border-accent outline-none resize-none"></textarea>
            </div>
          </div>
        }
      </div>

      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-text-main">Education</h2>
        <button (click)="addEducation()" class="text-accent hover:text-emerald-600 flex items-center gap-1 text-sm font-medium">
          <span class="material-icons text-sm">add</span> Add Education
        </button>
      </div>
      
      <div class="space-y-6 mb-8">
        @for (edu of data().education; track edu.id; let i = $index) {
          <div class="p-4 rounded-xl border border-gray-200 bg-gray-50/50 relative group">
            <button (click)="removeEducation(i)" class="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
              <span class="material-icons">delete_outline</span>
            </button>
            
            <div class="grid grid-cols-2 gap-4 mb-4 pr-8">
              <div class="col-span-2">
                <label class="block text-xs font-medium text-gray-500 mb-1">Institution</label>
                <input type="text" [ngModel]="edu.institution" (ngModelChange)="updateEducation(i, 'institution', $event)"
                       class="w-full px-3 py-1.5 text-sm rounded-md border border-gray-200 focus:border-accent outline-none">
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">Degree</label>
                <input type="text" [ngModel]="edu.degree" (ngModelChange)="updateEducation(i, 'degree', $event)"
                       class="w-full px-3 py-1.5 text-sm rounded-md border border-gray-200 focus:border-accent outline-none">
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">Year</label>
                <input type="text" [ngModel]="edu.year" (ngModelChange)="updateEducation(i, 'year', $event)"
                       class="w-full px-3 py-1.5 text-sm rounded-md border border-gray-200 focus:border-accent outline-none">
              </div>
            </div>
          </div>
        }
      </div>

      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-text-main">Projects</h2>
        <button (click)="addProject()" class="text-accent hover:text-emerald-600 flex items-center gap-1 text-sm font-medium">
          <span class="material-icons text-sm">add</span> Add Project
        </button>
      </div>
      
      <div class="space-y-6 mb-8">
        @for (proj of data().projects; track proj.id; let i = $index) {
          <div class="p-4 rounded-xl border border-gray-200 bg-gray-50/50 relative group">
            <button (click)="removeProject(i)" class="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
              <span class="material-icons">delete_outline</span>
            </button>
            
            <div class="mb-4 pr-8">
              <label class="block text-xs font-medium text-gray-500 mb-1">Project Name</label>
              <input type="text" [ngModel]="proj.name" (ngModelChange)="updateProject(i, 'name', $event)"
                     class="w-full px-3 py-1.5 text-sm rounded-md border border-gray-200 focus:border-accent outline-none">
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">Description</label>
              <textarea [ngModel]="proj.description" (ngModelChange)="updateProject(i, 'description', $event)" rows="3"
                        class="w-full px-3 py-1.5 text-sm rounded-md border border-gray-200 focus:border-accent outline-none resize-none"></textarea>
            </div>
          </div>
        }
      </div>

    </div>
  `
})
export class CvFormComponent {
  cvService = inject(CvBuilderService);
  data = this.cvService.cvData;

  updateField(field: keyof CVData, value: unknown) {
    this.cvService.updateData({ [field]: value });
  }

  addSkill(skill: string) {
    if (skill.trim() && !this.data().skills.includes(skill.trim())) {
      this.cvService.updateData({ skills: [...this.data().skills, skill.trim()] });
    }
  }

  removeSkill(index: number) {
    const newSkills = [...this.data().skills];
    newSkills.splice(index, 1);
    this.cvService.updateData({ skills: newSkills });
  }

  addExperience() {
    const newExp = {
      id: Date.now().toString(),
      company: '',
      role: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    this.cvService.updateData({ experience: [...this.data().experience, newExp] });
  }

  updateExperience(index: number, field: string, value: string) {
    const newExp = [...this.data().experience];
    newExp[index] = { ...newExp[index], [field]: value };
    this.cvService.updateData({ experience: newExp });
  }

  removeExperience(index: number) {
    const newExp = [...this.data().experience];
    newExp.splice(index, 1);
    this.cvService.updateData({ experience: newExp });
  }

  addEducation() {
    const newEdu = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      year: ''
    };
    this.cvService.updateData({ education: [...this.data().education, newEdu] });
  }

  updateEducation(index: number, field: string, value: string) {
    const newEdu = [...this.data().education];
    newEdu[index] = { ...newEdu[index], [field]: value };
    this.cvService.updateData({ education: newEdu });
  }

  removeEducation(index: number) {
    const newEdu = [...this.data().education];
    newEdu.splice(index, 1);
    this.cvService.updateData({ education: newEdu });
  }

  addProject() {
    const newProj = {
      id: Date.now().toString(),
      name: '',
      description: ''
    };
    this.cvService.updateData({ projects: [...this.data().projects, newProj] });
  }

  updateProject(index: number, field: string, value: string) {
    const newProj = [...this.data().projects];
    newProj[index] = { ...newProj[index], [field]: value };
    this.cvService.updateData({ projects: newProj });
  }

  removeProject(index: number) {
    const newProj = [...this.data().projects];
    newProj.splice(index, 1);
    this.cvService.updateData({ projects: newProj });
  }
}
