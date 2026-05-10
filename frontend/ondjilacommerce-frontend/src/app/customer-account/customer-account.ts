import { CommonModule } from '@angular/common';
import { UserService } from '../services/user/user.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-customer-account',
  imports: [CommonModule, RouterLink],
  templateUrl: './customer-account.html',
  styleUrl: './customer-account.scss',
})
export class CustomerAccount {
  cartService = inject(CartService);
  userService = inject(UserService);
}
