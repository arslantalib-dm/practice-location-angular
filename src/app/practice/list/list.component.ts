import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { PracticeService } from '../practice.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'practice-app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit, AfterViewInit {
  practices: any = [];
  expandedRow: number | null = null;
  pagination: any = {};
  page = 1;
  itemsPerPage = 10; // Adjust as needed
  practicesFilterForm: FormGroup;
  isFormValid: boolean = false;

  displayedColumns: string[] = [
    'id',
    'name',
    'qualifier',
    'phone',
    'address',
    'city',
    'state',
    'zip',
    'email',
    'fax',
    'is_active',
    'actions',
    // 'expand'
  ];

  detailColumns: string[] = ['detailId', 'detailName'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private practiceService: PracticeService,
    private router: Router
  ) {
    this.practicesFilterForm = this.resetForm();

  }

  resetForm(): FormGroup {
    return this.fb.group({
      name: [''],
      phone: [''],
    });
  }

  async onSubmit() {

    let filter: any = null;

    if (this.practicesFilterForm.value.name) {
      filter = { ...filter, name: this.practicesFilterForm.value.name };
    }
    if (this.practicesFilterForm.value.phone) {
      filter = { ...filter, phone: this.practicesFilterForm.value.phone };
    }
    const { perPage, currentPage } = this.pagination;
    this.fetchAllPractices(1, Number(perPage), filter);
  }

  async ngOnInit() {
    this.practicesFilterForm.valueChanges.subscribe(() => {
      this.checkFormValidity();
    });
    await this.fetchAllPractices();
  }

  async reset() {
    this.fetchAllPractices(1, Number(this.pagination.perPage));
  }

  checkFormValidity(): void {
    this.isFormValid = !!this.practicesFilterForm.value.name || !!this.practicesFilterForm.value.phone;
  }

  navigateToNewPractice() {
    this.router.navigate(['/practice/location']); // Navigate to the 'add' route under 'practice'
  }

  fetchAllPractices = async (page: number = 1, perPage: number = 10, filter = {}) => {
    try {
      const response = await this.practiceService.fetchPractices(
        page,
        perPage,
        filter
      );
      this.practices = response.data;
      this.pagination = {
        from: response.from,
        to: response.to,
        total: response.total,
        perPage: response.per_page,
        currentPage: response.current_page - 1,
        previousPage: response.prev_page_url
          ? response.current_page - 1 - 1
          : null,
        nextPage: response.next_page_url ? response.current_page - 1 + 1 : null,
        totalPages: response.last_page,
      };
      console.log('practices ===>', this.practices);
      // Update MatTableDataSource with fetched data
    } catch (error: any) {
      console.log(
        'error for fetching practices => ',
        error.message ?? error.data.message
      );
    }
  };

  ngAfterViewInit() {}
  get pagedPractices() {
    const startIndex = (this.page - 1) * this.itemsPerPage;
    return this.practices.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.practices.length / this.itemsPerPage);
  }

  toggleDetails(index: number) {
    this.expandedRow = this.expandedRow === index ? null : index;
  }

  pageChanged(value: any) {
    console.log({ value });
    const { pageIndex, pageSize } = value;
    this.fetchAllPractices(pageIndex + 1, pageSize);
  }

  editPractice(practice: any) {
    // Logic to edit the practice details
    console.log('Edit practice:', practice.id);

    this.router.navigate(['/practice/location', practice.id]);

  }

  async changeStatus(status: boolean, id: number) {
    console.log({ status });

    await this.practiceService.changePracticeStatus(id, status);
  }
}
