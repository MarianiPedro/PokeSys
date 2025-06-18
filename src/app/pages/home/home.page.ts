import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonThumbnail, 
  IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle
} from '@ionic/angular/standalone';
import { forkJoin } from 'rxjs';

import { PokeapiService } from 'src/app/services/pokeapi.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonThumbnail,
    IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,
    CommonModule, FormsModule]
})
export class HomePage implements OnInit {
  pokemons: any[] = [];
  offset = 0;
  limit = 150;

  constructor(private pokeapi: PokeapiService) { }

  ngOnInit() {
    this.loadPokemons();
  }


  loadPokemons() {
    this.pokeapi.getPokemonList(this.offset, this.limit).subscribe(response => {
      const basicList = response.results;

      const detailsObservables = basicList.map((pokemon: any) =>
        this.pokeapi.getPokemonDetails(pokemon.name)
      );

      forkJoin(detailsObservables).subscribe((details: unknown) => {
        
        const list = details as any[];
        this.pokemons = list.map(p => ({
          name: p.name,
          id: p.id,
          height: p.height,
          weight: p.weight,
          types: p.types.map((t: any) => t.type.name),
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`
        }));
      });
    });

    console.log('Pokémons formatados:', this.pokemons);
  }
}
