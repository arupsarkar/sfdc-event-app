import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../api.service';
import {MessageService} from '../message.service';
import {Contact} from '../model/Contact';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
  // variables declaration
  displayedColumns: string[] = ['Id', 'FirstName', 'LastName', 'MobilePhone', 'Email', 'Edit', 'Delete'] ;
  dataSource = new MatTableDataSource<Contact>();
  selectedContact: Contact = new Contact();
  contactsExists: boolean;
  contactsExistHeader: string;
  message = '';
  contacts: Contact[];
  tileColor: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private route: ActivatedRoute, private  apiService: ApiService, private messageService: MessageService) {
    this.tileColor = '#455a64';
    this.contactsExistHeader = 'Contacts';
  }

  ngOnInit() {
    this.apiService.getContacts().subscribe(
      contacts => {
        this.contacts = contacts;
        this.log(this.contacts.length + ' contacts fetched.');
        this.contactsExists = contacts.length > 0;
        this.dataSource = new MatTableDataSource(this.contacts);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        if (!this.contactsExists) {
          this.contactsExistHeader = 'There are no contacts in this org.';
        }
    }, error => {
        this.log('Contacts fetched error.' + error);
      }, () => {
        this.log('Contacts fetch operation completed successfully.');
      });
  }


  editContact(contact: Contact): void {
    console.log('Edit contact ', JSON.stringify(contact));
    this.selectedContact = contact;
  }

  deleteContact(contact: Contact): void {
    console.log('Deleted contact ', JSON.stringify(contact));
    this.contacts = this.contacts.filter(l => l !== contact);
  }

  createContact(contact: Contact): void {
    console.log('Create contact ', JSON.stringify(contact));
    // check if the id already exists - update, else insert
    if (this.selectedContact.Id !== undefined) {
      console.log('update contact component id ', contact.Id);
    } else {
      console.log('create contact component id ', JSON.stringify(contact));
      this.apiService.createContact(contact).subscribe(
        data => {
          this.message = JSON.stringify(data);
          this.log(`${this.message}`);
      },
        err => {
          this.log('Contacts create error.' + err);
        },
        () => {
          this.log('Contacts create operation completed successfully.');
        });
    }

  }
  /** Log a EventService message with the MessageService */
  private log(message: string) {
    const d = new Date();
    const datePart = d.toLocaleDateString();
    const timePart = d.toLocaleTimeString();
    const finalDateTime = datePart + ' ' + timePart;
    this.messageService.add(`${finalDateTime} : Contact Component: ${message}`);
  }

}
