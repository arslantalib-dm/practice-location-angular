import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Modal } from 'bootstrap';
import { PracticeService } from '../../practice.service';

@Component({
  selector: 'app-practice-location-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
})
export class PracticeLocationAddComponent
  implements OnInit, AfterViewInit, OnChanges
{
  practicesLocationForm: FormGroup;
  regions: any = [];
  services: any = [];
  days: string[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  @Output() fetchLocations = new EventEmitter<void>();
  @Output() modalClosed = new EventEmitter<void>();
  @Input() facilityId: any;
  @Input() locationId: number | any = null;

  modal: any;

  constructor(
    private fb: FormBuilder,
    private practiceservice: PracticeService
  ) {
    this.practicesLocationForm = this.clearForm();
    this.getRegions();
    this.getServices();
  }

  resetForm() {
    this.practicesLocationForm = this.clearForm();
  }

  ngOnInit() {
    if (this.locationId) {
      this.loadLocationData();
    }
  }

  ngAfterViewInit(): void {
    // if (this.modalRef) {
    //   this.modal = new Modal(this.modalRef.nativeElement);
    // }
  }

  ngOnChanges(): void {
    if (this.facilityId) {
      this.resetForm();
    }
  }

  async loadLocationData() {
    try {
      const locationData = await this.practiceservice.findPracticeLocation(
        this.locationId
      );
      this.practicesLocationForm.patchValue(locationData);

      // this.practicesLocationForm.patchValue({
      //   ...locationData,
      //   timings: {
      //     ...locationData.timing,
      //   },
      // });

      locationData.timing.forEach((time: any) => {
        const dayButton = document.getElementById(`day-${time.day_id}`);

        const timingsArray = this.practicesLocationForm.get(
          'timings'
        ) as FormArray;
        dayButton?.classList.add('active');
          timingsArray.push(this.createTimingGroup(time.day_id, this.days[time.day_id -1], time.start_time, time.end_time));
      });
    } catch (error) {
      console.error('Error loading location data', error);
    }
  }

  updateTimingValidators(index: number, isChecked: boolean) {
    const timingGroup = (
      this.practicesLocationForm.get('timings') as FormArray
    ).at(index) as FormGroup;
    const startTimeControl: any = timingGroup.get('start_time');
    const endTimeControl: any = timingGroup.get('end_time');

    if (isChecked) {
      startTimeControl.setValidators([Validators.required]);
      endTimeControl.setValidators([Validators.required]);
    } else {
      startTimeControl.clearValidators();
      endTimeControl.clearValidators();
    }

    startTimeControl.updateValueAndValidity();
    endTimeControl.updateValueAndValidity();
  }

  get timingsFormArray(): FormArray {
    return this.practicesLocationForm.get('timings') as FormArray;
  }

  clearForm(): FormGroup {
    console.log('facility id', this.facilityId);

    return this.fb.group({
      id: [''],
      facility_id: [this.facilityId, [Validators.required]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      qualifier: ['', [Validators.required, Validators.minLength(2)]],
      address: [''],
      city: [''],
      state: [''],
      zip: [''],
      floor: [''],
      phone: [''],
      email: [''],
      fax: [''],
      dean: ['', [Validators.pattern('^[x]{2}[0-9]{7}$')]],
      region_id: ['', [Validators.required]],
      place_of_service_id: ['', [Validators.required]],
      lat: [''],
      long: [''],
      is_main: false,
      current_location_id: [2],
      time_zone: this.fb.group({
        time_zone: ['-300', [Validators.required]],
        time_zone_string: ['Asia/Karachi', [Validators.required]],
      }),
      timings: this.fb.array([], [Validators.required]), // Initialize as an empty array
    });
  }

  createTimingGroup(dayId: number, dayName: string, startTime: string = '06:00', endTime: string = '18:00') {
    console.log('creating time');

    return this.fb.group({
      checked: [true],
      day_id: [dayId, Validators.required],
      day_name: [dayName, Validators.required],
      start_time: [startTime, Validators.required],
      end_time: [endTime, Validators.required],
    });
  }

  toggleDaySelection(dayId: number, dayName: string) {
    const dayButton = document.getElementById(`day-${dayId}`);

    const timingsArray = this.practicesLocationForm.get('timings') as FormArray;
    console.log({ timingsArray });

    const index = timingsArray.controls.findIndex(
      (group: any) => group.get('day_id').value === dayId
    );
    console.log({ index });

    if (index !== -1) {
      dayButton?.classList.remove('active');
      timingsArray.removeAt(index);
    } else {
      dayButton?.classList.add('active');
      timingsArray.push(this.createTimingGroup(dayId, dayName));
    }
  }

  async onSubmit() {
    console.log('data ==>', this.practicesLocationForm.value);

    this.markFormGroupTouched(this.practicesLocationForm);
    if (this.practicesLocationForm.invalid) {
      return;
    }
    if (this.practicesLocationForm.valid) {
      console.log('Adding new record...', this.practicesLocationForm.value);
      // Perform add operation
      const response = await this.practiceservice.addPracticeLocation(
        this.practicesLocationForm.value
      );

      this.modalClosed.emit();
      this.fetchLocations.emit(this.facilityId);
    }
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

  async getRegions() {
    console.log('call api');

    const response = await this.practiceservice.getRegions();
    console.log({ response });

    this.regions = response.data;
  }

  async getServices() {
    const response = await this.practiceservice.getServices();

    this.services = response.data;
  }
}
