import {Component, OnInit} from '@angular/core';
import {User} from "../bean/User";
import {PhonebookService} from "../phonebook.service";
import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import {ErrorStateMatcher} from '@angular/material/core';
import {Observable} from "rxjs";
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-phone-book',
  templateUrl: './phone-book.component.html',
  styleUrls: ['./phone-book.component.css']
})
export class PhoneBookComponent implements OnInit {


  matcher = new MyErrorStateMatcher();
  private user: User;
  private selectedUser: User;
  private users: User[];
  private subForm: FormGroup;
  spinner: boolean;


  get phoneNumber() {
    return this.subForm.get('phoneNumber');
  }

  get nameFormControl() {
    return this.subForm.get('nameFormControl');
  }

  constructor(private phonebookService: PhonebookService) {
  }

  filteredOptions: Observable<User[]>;
  filterControl = new FormControl();

  ngOnInit() {
    this.fetchUsers();
    this.filteredOptions = this.filterControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.users.slice())
      );
    this.spinner = false;
    this.user = {id: 0, name: "", phoneNumber: ""};
    this.users = [];

    this.subForm = new FormGroup({
      'nameFormControl': new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),

      'phoneNumber': new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.pattern("^([0-9]{10})")
      ])
    });
  }

  displayUser(user?: User): string | undefined {
    return user ? user.name : undefined;
  }

  addUser() {
    if (this.subForm.valid) {

      this.user.name = this.nameFormControl.value;
      this.user.phoneNumber = this.phoneNumber.value;
      var self = this;
      this.spinner = true;
      this.phonebookService.saveUser(this.user).subscribe(res => {
        console.log(res);
        var data = res.DATA;
        self.spinner = false;
        alert(data.MESSAGE);
        self.users = data.USERS;
        self.user = {id: 0, name: "", phoneNumber: ""}
      });
    }
  }

  updateSelectedUser(u: User) {

    this.selectedUser = u;
  }

  deleteUser(u: User) {
    this.phonebookService.deleteuser(u).subscribe(res => {
      var data = res.DATA;
      alert(data.MESSAGE);
      if (data.STATUS == "success") {
        let i = this.users.indexOf(this.selectedUser);
        this.users.splice(i, 1);
      }

    });
  }

  fetchUsers() {
    let self = this;
    this.phonebookService.fetchUsers().subscribe(res => {
      var data = res.DATA;
      this.users = data.DATA;

    });
  }

  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();
    return this.users.filter(u => u.name.toLowerCase().indexOf(filterValue) === 0);
  }

  filterUser(ind: any) {
    this.selectedUser = ind
  }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form.submitted && form;
    return !!(control.invalid && control && (control.dirty || isSubmitted || control.touched));
  }
}
