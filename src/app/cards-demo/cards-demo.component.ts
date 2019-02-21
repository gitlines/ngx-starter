import { Component, OnInit } from '@angular/core';


export enum Status {
  Backlog = 'backlog',
  ToDo = 'todo',
  Doing = 'doing',
  Done = 'done'
}


@Component({
  selector: 'starter-demo-cards-demo',
  templateUrl: './cards-demo.component.html',
  styleUrls: ['./cards-demo.component.scss']
})
export class CardsDemoComponent implements OnInit {


}
