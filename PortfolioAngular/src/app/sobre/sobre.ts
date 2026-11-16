import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-sobre',
  imports: [
    MatCardModule,
    MatExpansionModule
  ],
  templateUrl: './sobre.html',
  styleUrl: './sobre.css'
})
export class Sobre {}