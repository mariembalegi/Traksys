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

  getPageItems(): (number | string)[] {
    const items: (number | string)[] = [];
    const total = this.totalPages;
    const current = this.currentPage;

    if (total <= 9) {
      // Show all pages if 9 or fewer
      for (let i = 1; i <= total; i++) {
        items.push(i);
      }
    } else {
      // Always show first page
      items.push(1);

      if (current <= 4) {
        // Current page is near the beginning
        for (let i = 2; i <= 6; i++) {
          items.push(i);
        }
        items.push('...');
        items.push(total);
      } else if (current >= total - 3) {
        // Current page is near the end
        items.push('...');
        for (let i = total - 5; i <= total; i++) {
          items.push(i);
        }
      } else {
        // Current page is in the middle
        items.push('...');
        for (let i = current - 1; i <= current + 1; i++) {
          items.push(i);
        }
        items.push('...');
        items.push(total);
      }
    }

    return items;
  }
}

