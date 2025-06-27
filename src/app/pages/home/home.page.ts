import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { forkJoin } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { PokeapiService } from 'src/app/services/pokeapi.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
})
export class HomePage implements OnInit {
  pokemons: any[] = [];
  offset = 0;
  limit = 20;
  
  route = inject(ActivatedRoute);
  id: string | null = null;
  
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

  getNumberNationalDex(species: any): string {
    const entry = species.pokedex_numbers.find((e: any) => e.pokedex.name === 'national');
    return entry.entry_number;
  }
}
