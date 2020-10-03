import { Component, OnInit } from '@angular/core';
import { TempoService } from 'src/app/services/tempo.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private tempo: TempoService) { }

  cidade: string = "Cuiaba";

  ngOnInit(): void {
  }

  procurar(){
    this.tempo.getBy(this.cidade).subscribe((retorno: any) => {
      console.log(retorno);
    })
  }
}
