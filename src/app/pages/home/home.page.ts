import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonThumbnail, IonLabel } from '@ionic/angular/standalone';
import { PokeapiService } from 'src/app/services/pokeapi.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonThumbnail, IonLabel,
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
      this.pokemons = response.results.map((pokemon: any) => {
        // Extrai o ID da URL
        const id = pokemon.url.split('/').filter(Boolean).pop();
        return {
          name: pokemon.name,
          id,
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
        };
      });
    });
  }
}
