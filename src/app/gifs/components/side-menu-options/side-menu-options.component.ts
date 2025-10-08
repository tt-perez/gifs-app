import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { GifsService } from '../../services/gifs.service';


interface MenuOptions {
label :string;
subLabel: string;
route: string;
icon: string;
}

@Component({
  selector: 'app-side-menu-options',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './side-menu-options.component.html',

})
export class SideMenuOptionsComponent {

  gifService = inject(GifsService);
  menuOptions : MenuOptions[] = [
  {label: 'Trending',
    subLabel: 'Popular Gifs',
    route: '/dashboard/trending',
    icon: 'fa-solid fa-chart-line'
  },

    {label: 'Browser',
    subLabel: 'Search Gifs',
    route: '/dashboard/search',
    icon: 'fa-solid fa-magnifying-glass'
  },
 ]
 }
