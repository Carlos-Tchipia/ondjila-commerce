import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterLink, RouterOutlet, CommonModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin {
  userService = inject(UserService);
  router = inject(Router);
  
  currentUser = this.userService.getCurrentUser();

  logout() {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
