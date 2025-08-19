import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-paginator',
  imports: [],
  templateUrl: './paginator.html',
  styleUrl: './paginator.scss'
})
export class Paginator {
  @Input() items: any[] = [];
  @Input() itemsPerPage: number = 8;
  @Output() pageChange = new EventEmitter<any[]>();

  currentPage = 1;
  totalPages = 0;
  pagedItems: any[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['items']) {
      this.totalPages = Math.ceil(this.items.length / this.itemsPerPage);
      this.setPage(1);
    }
  }

  setPage(page: number) {
    if (page < 1) page = 1;
    if (page > this.totalPages) page = this.totalPages;
    this.currentPage = page;

    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.pagedItems = this.items.slice(startIndex, endIndex);

    this.pageChange.emit(this.pagedItems);
  }
}

