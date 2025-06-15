import { HistoryService } from '../../core/services/history/history.service';

import { Component, computed, OnInit, signal } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IHistory } from '../../core/interfaces/ihistory';



@Component({
  selector: 'app-history',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
})
export class HistoryComponent implements OnInit {
  historyItems = signal<IHistory[]>([]);

  filterText = signal('');

  selectedItem = signal<IHistory | null>(null);

  sortDirection = signal<'asc' | 'desc'>('desc'); 

  filteredAndSortedItems = computed(() => {
    const items = this.historyItems();
    const filter = this.filterText().toLowerCase();
    let filtered = items.filter((item) =>
      item.name.toLowerCase().includes(filter)
    );
    return filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return this.sortDirection() === 'asc' ? dateA - dateB : dateB - dateA;
    });
  });

  constructor(private historyService: HistoryService) {}

  ngOnInit() {
    this.fetchHistory();
  }

  fetchHistory() {
    this.historyService.getHistory().subscribe({
      next: (items) => {
        this.historyItems.set(items);
      },
      error: (err) => {
        console.error('Failed to fetch history:', err);
      },
    });
  }

// fetchHistory() {
//     // Fake data for testing
//     const fakeData: IHistory[] = [
//       {
//         image: 'https://picsum.photos/id/1/200/300',
//         date: '2025-06-11T15:30:00Z',
//         name: 'Suspicious Activity',
//         status:"fake",
//       },
//       {
//         image: 'https://picsum.photos/id/2/200/300',
//         date: '2025-06-10T12:00:00Z',
//         name: 'Motion Detected',
//         status:"fake",

//       },
//       {
//         image: 'https://picsum.photos/id/3/200/300',
//         date: '2025-06-09T09:15:00Z',
//         name: 'Door Opened',
//         status:"fake",

//       },
//       {
//         image: 'https://picsum.photos/id/4/200/300',
//         date: '2025-06-08T18:45:00Z',
//         name: 'Unknown Person',
//         status:"fake",

//       },
//     ];
//     this.historyItems.set(fakeData);
//   }


  toggleSortDirection() {
    this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
  }


  openImageModal(item: IHistory) {
    this.selectedItem.set(item); 
  }

  closeImageModal() {
    this.selectedItem.set(null); 
  }



}