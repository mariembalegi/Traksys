import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-status-header',
  imports: [],
  templateUrl: './status-header.html',
  styleUrl: './status-header.scss'
})
export class StatusHeader {
  @Input() header!: string;
  @Input() number!: string;
}
