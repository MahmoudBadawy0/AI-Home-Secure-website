
import { HistoryService } from '../../core/services/history/history.service';

import { Component, OnInit } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Log {
  id: number;
  timestamp: string;
  theftDetected: boolean;
}

@Component({
  selector: 'app-history',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
})
export class HistoryComponent implements OnInit {
  logs: Log[] = [];
  filteredLogs: Log[] = [];
  paginatedLogs: Log[] = [];
  filterText = '';
  sortDirection: 'asc' | 'desc' = 'desc';
  showDetailsModal = false;
  selectedLog: Log | null = null;
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  pageNumbers: number[] = [];

  constructor(private securityService: HistoryService) {}

  ngOnInit() {
    this.fetchLogs();
  }

  fetchLogs() {
    this.securityService.getTheftLogs().subscribe({
      next: (logs) => {
        this.logs = logs;
        this.filteredLogs = [...logs];
        this.updatePagination();
      },
      error: () => {
        this.filteredLogs = [];
        this.paginatedLogs = [];
        this.updatePagination();
      }
    });
  }

  filterLogs() {
    const search = this.filterText.toLowerCase();
    this.filteredLogs = this.logs.filter(log =>
      (log.theftDetected ? 'theft reported' : 'no theft').toLowerCase().includes(search)
    );
    this.currentPage = 1;
    this.updatePagination();
  }

  sortLogs(key: keyof Log) {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.filteredLogs.sort((a, b) => {
      const valueA = a[key];
      const valueB = b[key];
      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredLogs.length / this.pageSize);
    this.currentPage = Math.min(this.currentPage, this.totalPages || 1);
    this.paginatedLogs = this.filteredLogs.slice(
      (this.currentPage - 1) * this.pageSize,
      this.currentPage * this.pageSize
    );
    this.pageNumbers = Array.from(
      { length: this.totalPages },
      (_, i) => i + 1
    );
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  openDetailsModal(log: Log) {
    this.selectedLog = log;
    this.showDetailsModal = true;
  }

  exportToCsv() {
    const headers = ['ID', 'Timestamp', 'State'];
    const rows = this.logs.map(log => [
      log.id.toString(),
      new Date(log.timestamp).toLocaleString(),
      log.theftDetected ? 'Theft Reported' : 'No Theft'
    ]);
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'system-logs.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}