import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PokeapiService } from 'src/app/services/pokeapi.service';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-detalhes',
  templateUrl: './detalhes.page.html',
  styleUrls: ['./detalhes.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IonicModule]
})
export class DetalhesPage implements OnInit {
  route = inject(ActivatedRoute);
  pokemon: any;
  id: string | null = null;
  
  constructor(private pokeapi: PokeapiService) { }

  ngOnInit() {
    this.detailsPokemon();
  }

  detailsPokemon() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if(id){
        this.pokeapi.getPokemonDetails(id).subscribe(p => {
          this.pokeapi.getPokemonSpecies(p.name).subscribe(species => {
            this.pokemon = ({
              name: p.name,
              id: p.id,
              height: p.height,
              weight: p.weight,
              types: p.types.map((t: any) => t.type.name),
              image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`,
              sprites: p.sprites,
              species: species
            });
          });
        })
      }
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
