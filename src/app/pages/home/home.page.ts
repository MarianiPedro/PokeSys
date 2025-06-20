import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonThumbnail, 
  IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonIcon, IonButton,
} from '@ionic/angular/standalone';
import { forkJoin } from 'rxjs';

import { PokeapiService } from 'src/app/services/pokeapi.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonThumbnail, IonIcon, IonButton, 
    IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,
    CommonModule, FormsModule, RouterModule],
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
        this.pokeapi.getPokemonDetails(pokemon.name));

      forkJoin(detailsObservables).subscribe((details: unknown) => {
        const list = details as any[];
        const speciesObservables = list.map(p =>
          this.pokeapi.getPokemonSpecies(p.id)
        );

        forkJoin(speciesObservables).subscribe((speciesList: any[]) => {
          this.pokemons = list.map((p, index) => ({
            name: p.name,
            id: p.id,
            height: p.height,
            weight: p.weight,
            types: p.types.map((t: any) => t.type.name),
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`,
            sprites: p.sprites,
            species: speciesList[index]
          }));
        });
      });
    });
  }

  getFlavorText(species: any): string {
    const entry = species.flavor_text_entries.find((e: any) => e.language.name === 'en');
    return entry.flavor_text.replace(/\f/g, ' ');
  }

  getNumberNationalDex(species: any): string {
    const entry = species.pokedex_numbers.find((e: any) => e.pokedex.name === 'national');
    return entry.entry_number;
  }

  getGenus(species: any): string {
    const entry = species.genera.find((e: any) => e.language.name === 'en');
    return entry.genus;
  }

}
