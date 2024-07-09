import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PracticeService } from '../practice.service';
import { Practice } from '../interface/practice.interface';
import * as $ from 'jquery';
import * as bootstrap from 'bootstrap';
import { Modal } from 'bootstrap';
import { PracticeLocationAddComponent } from '../location/add/add.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-practice-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
})
export class PracticeAddComponent implements OnInit, AfterViewInit {
  practicesForm: FormGroup;
  isEditMode: boolean = false;
  locations: any = [];
  pagination: any = {};
  showAddLocationComponent: boolean = false;
  selectedLocationId: any;
  facilityId: any;
  file: any;
  isSignatureUpload: boolean = false;
  signatureFilePath: string = '';

  @ViewChild('addLocation') modalRef!: ElementRef;
  @ViewChild('locationComponent')
  locationComponent!: PracticeLocationAddComponent;

  modal: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private practiceservice: PracticeService
  ) {
    this.practicesForm = this.resetForm();
  }

  ngAfterViewInit(): void {
    if (this.modalRef) {
      this.modal = new Modal(this.modalRef.nativeElement);
    }
  }

  resetForm(): FormGroup {
    return this.fb.group({
      id: [''],
      name: ['', [Validators.required, Validators.minLength(3)]],
      qualifier: ['', [Validators.required, Validators.minLength(2)]],
      generate_document_using: ['', [Validators.required]],
      location: this.fb.group({
        id: [''],
        address: [''],
        city: [''],
        state: [''],
        zip: [''],
        floor: [''],
        phone: [''],
        email: [''],
        ext_no: [''],
        cell_no: [''],
        fax: [''],
        same_as_provider: [''],
        dean: [''],
        is_main: true,
        billing: this.fb.group({
          id: [''],
          provider_name: [''],
          address: [''],
          city: [''],
          state: [''],
          zip: [''],
          floor: [''],
          phone: [''],
          email: [''],
          ext_no: [''],
          cell_no: [''],
          npi: [''],
          dol: [''],
          tax_id_check: [
            '',
            [Validators.required, Validators.pattern('^[1-2]$')],
          ],
          tin: [null, [Validators.pattern('^[0-9]{9}$')]],
          ssn: [null, [Validators.pattern('^[0-9]{9}$')]],
        }),
      }),
      signature_title: ['', [Validators.required, Validators.minLength(3)]],
      signature_file: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];

      if (id) {
        this.isEditMode = true;
        this.facilityId = id;
        // Fetch the data for the given ID and populate the form
        this.loadFormData(id);
        this.getLocations(id);
      }
    });

    this.practicesForm
      .get('location')
      ?.get('same_as_provider')
      ?.valueChanges.subscribe((value) => {
        this.toggleBillingFields(value);
      });
  }

  async loadFormData(id: number) {
    const response = await this.practiceservice.findPractice(id);
    const signature = await this.practiceservice.getSignature(id, 'facilitySignature');
    console.log({ response });

    if (signature.length) {
      this.isSignatureUpload = true;
      this.signatureFilePath = environment.backendWebUrl + signature[0]?.file_link;
    }

    console.log('asd', environment.backendWebUrl + signature[0]?.file_link);


    this.practicesForm.patchValue({
      ...response,
      signature_title: signature[0]?.file_title ?? '',
      signature_file: signature[0]?.file_name ?? '',
      location: {
        ...response?.location[0],
        billing: {
          ...response?.location[0]?.billing[0],
          tax_id_check: response?.location[0]?.billing[0]?.tax_id_check.toString(),
        },
      },
    });
  }

  toggleBillingFields(sameAsProvider: boolean): void {
    if (sameAsProvider) {
      const providerValues = {
        provider_name: this.practicesForm.get('name')?.value,
        address: this.practicesForm.get('location')?.get('address')?.value,
        city: this.practicesForm.get('location')?.get('city')?.value,
        state: this.practicesForm.get('location')?.get('state')?.value,
        zip: this.practicesForm.get('location')?.get('zip')?.value,
        floor: this.practicesForm.get('location')?.get('floor')?.value,
        phone: this.practicesForm.get('location')?.get('phone')?.value,
        email: this.practicesForm.get('location')?.get('email')?.value,
        ext_no: this.practicesForm.get('location')?.get('ext_no')?.value,
        cell_no: this.practicesForm.get('location')?.get('cell_no')?.value,
      };
      this.practicesForm.patchValue({
        location: {
          billing: providerValues,
        },
      });
      Object.keys(providerValues).forEach((field) => {
        this.practicesForm
          .get('location')
          ?.get('billing')
          ?.get(field)
          ?.disable();
      });
    } else {
      Object.keys(
        (this.practicesForm.get('location')?.get('billing') as FormGroup)
          ?.controls ?? {}
      ).forEach((field) => {
        (this.practicesForm.get('location')?.get('billing') as FormGroup)
          ?.get(field)
          ?.enable();
      });
    }
  }

  async onSubmit() {
    console.log('data ==>', this.practicesForm.value);

    this.markFormGroupTouched(this.practicesForm);
    if (this.practicesForm.invalid) {
      return;
    }
    if (this.practicesForm.valid) {
      console.log('payload ==> ', this.practicesForm.value);

      let facilityResponse: any = null;
      if (this.isEditMode) {
        console.log('Updating record...', this.practicesForm.value);
        // Perform update operation
        const response = await this.practiceservice.updatePractice(
          this.practicesForm.value as Practice
        );
        facilityResponse = response;
        console.log({ response });
      } else {
        console.log('Adding new record...', this.practicesForm.value);
        // Perform add operation
        const response = await this.practiceservice.addPractice(
          this.practicesForm.value as Practice
        );
        facilityResponse = response;
        console.log({ response });
      }

      if (this.file) {
        const formData = new FormData();
        formData.append('object_id', facilityResponse?.id);
        formData.append('doc_type', 'facilitySignature');
        formData.append('file_title', this.practicesForm.value.signature_title);
        formData.append('signature_file', this.file);

        const response = this.practiceservice.uploadSignature(formData);

        console.log({ response });

      }

      this.router.navigate(['/']);
    }
  }

  async getLocations(id: number, page: number = 1, perPage: number = 10) {
    const response = await this.practiceservice.fetchPracticeLocations(
      id,
      page,
      perPage
    );

    this.locations = response.data;

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
  }

  pageChanged(value: any) {
    console.log({ value });
    const { pageIndex, pageSize } = value;
    this.getLocations(pageIndex + 1, pageSize);
  }

  editPracticeLocation(location: any) {
    const { id } = location;
    this.selectedLocationId = id;
    this.showAddLocationComponent = false;

    // Use a small delay to ensure the DOM updates
    setTimeout(() => {
      this.showAddLocationComponent = true;
      this.modal = new Modal(this.modalRef.nativeElement);
      this.modal.show();
    }, 0);
  }

  async changeLocationStatus(status: boolean, id: number) {
    console.log({ status });

    await this.practiceservice.changePracticeLocationStatus(id, status);
    this.getLocations(this.facilityId);
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }

  addlocation() {
    this.showAddLocationComponent = false;

    // Use a small delay to ensure the DOM updates
    setTimeout(() => {
      this.showAddLocationComponent = true;
      this.modal = new Modal(this.modalRef.nativeElement);
      this.modal.show();
    }, 0);
  }

  closeModal() {
    this.showAddLocationComponent = false;
    this.modal?.hide(); // Hide the modal
  }

  uploadImage(event: any) {
    this.file = event.target.files[0];
    console.log('file ==>', this.file);
  }

  removeSignature() {
    this.practicesForm.patchValue({
      signature_title: '',
      signature_file: '',
    });
    this.isSignatureUpload = false;
    this.signatureFilePath = '';
  }
}
