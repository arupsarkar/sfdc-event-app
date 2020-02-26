import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../api.service';
import {MessageService} from '../message.service';
import {Contact} from '../model/Contact';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {SearchParams} from '../model/Search';
import {SOSLSearchResult} from '../model/SOSLSearchResult';

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
  newContact: Contact[];
  tileColor: string;
  search: SearchParams = new SearchParams();
  searchResults: SOSLSearchResult[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private route: ActivatedRoute, private  apiService: ApiService, private messageService: MessageService) {
    this.tileColor = '#455a64';
    this.contactsExistHeader = 'Contacts';
  }

  ngOnInit() {
    this.getContacts();
  }

  applyFilter(filterValue: string) {
    console.log('Search Filter : ', filterValue);
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if ( filterValue.length < 1 ) {
      this.searchResults = undefined;
    }
  }

  searchSOSL(search: SearchParams): void {
    console.log('Search Params : ', JSON.stringify(search));
    this.apiService.searchSOSL(search).subscribe(
      searchResults => {
        this.searchResults = searchResults;
        this.message = JSON.stringify(this.searchResults);
        this.log(`${this.message}`);
      },
      err => {
        this.log('Search SOSL error.' + err);
      },
      () => {
        this.log('Search SOSL operation completed successfully.');
      });
  }

  clearForm(): void {
    this.selectedContact.Id = undefined;
    this.selectedContact.FirstName = undefined;
    this.selectedContact.LastName = undefined;
    this.selectedContact.Email = undefined;
    this.selectedContact.MobilePhone = undefined;
  }

  getContacts(): void {
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
    this.apiService.deleteContact(contact).subscribe(
      data => {
        this.message = JSON.stringify(data);
        this.log(`${this.message}`);
        this.getContacts();
      },
      err => {
        this.log('Delete contact error.' + err);
      },
      () => {
        this.log('Delete contact operation completed successfully.');
      });
  }

  createContact(contact: Contact): void {
    console.log('Create contact ', JSON.stringify(contact));
    // check if the id already exists - update, else insert
    if (this.selectedContact.Id !== undefined) {
      console.log('update contact component id ', contact.Id);
      this.apiService.updateContact(contact).subscribe(
        data => {
          this.message = JSON.stringify(data);
          this.log(`${this.message}`);
          this.getContacts();
          const kafkaData = JSON.stringify(data);
          // now publish the vent to a kafka queue
          this.apiService.publishKafkaEvents(kafkaData).subscribe(
            res => {
              this.message = JSON.stringify(res);
              this.log(`${this.message}`);
            },
            err => {
              this.log('Contacts publish create error.' + err);
            },
            () => {
              this.log('Contacts publish event successfully.');
            });

        },
        err => {
          this.log('Contacts create error.' + err);
        },
        () => {
          this.log('Contacts update operation completed successfully.');
        });

    } else {
      console.log('create contact component id ', JSON.stringify(contact));
      this.apiService.createContact(contact).subscribe(
        data => {
          this.message = JSON.stringify(data);
          this.log(`${this.message}`);
          this.getContacts();
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
