import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CvBuilderService, CVData } from '../cv-builder.service';

@Component({
  selector: 'app-cv-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cv-form.component.html',
  styleUrl: './cv-form.component.css'
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
