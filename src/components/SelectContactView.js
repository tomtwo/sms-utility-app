
// @flow

import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Button, List, SearchBar } from 'antd-mobile';
import { Contacts, Permissions } from 'expo';

import type { Contact, ContactPhoneNumber } from '../types';
import { debounce } from '../utils';

const CONTACTS_PAGE_SIZE = 1000;
const SEARCH_DEBOUNCE_TIME_MS = 500;

export const ContactView = (contact: Contact) => (
  <View style={styles.container}>
    <Text>{contact.name}</Text>
    <Text>view</Text>
  </View>
);

export default class SelectContactView extends React.Component {
  static propTypes = {
    navigation: React.PropTypes.object.isRequired,
  }

  static navigationOptions = {
    title: 'Contacts'
  }

  state : {
    contacts: ?Contact[],
    contactsPage: number,
    contactsFinished: bool,
    contactsTotal: ?number,
    contactsSearchResults: ?Contact[],
    searchQuery: string,
  } = {
    contacts: null,
    contactsPage: 0,
    contactsFinished: false,
    contactsTotal: null,
    contactsSearchResults: null,
    searchQuery: '',
  }

  componentDidMount() {
    if (!this.state.contacts) {
      this._getContacts();
    }
  }

  _getContacts = async () => {
    if (this.state.contactsFinished || (this.state.contactsTotal && (this.state.contactsPage * CONTACTS_PAGE_SIZE) > this.state.contactsTotal)) {
      return;
    }

    // Ask for permission to query contacts.
    const permission = await Permissions.askAsync(Permissions.CONTACTS);
    if (permission.status !== 'granted') {
      // Permission was denied...
      return;
    }

    type ContactsResponse = {
      data: Contact[],
      hasNextPage: number,
      hasPreviousPage: number,
      total: number,
    };

    // fetch first page of contacts
    const contactsResponse : ContactsResponse = await Contacts.getContactsAsync({
      fields: [
        Contacts.PHONE_NUMBERS,
        // Contacts.EMAILS,
      ],
      pageSize: CONTACTS_PAGE_SIZE,
      pageOffset: this.state.contactsPage * CONTACTS_PAGE_SIZE,
    });

    const contacts : Contact[] = contactsResponse.data;

    console.log(`fetched contacts for page ${this.state.contactsPage}, ${this.state.contactsPage * CONTACTS_PAGE_SIZE + contacts.length} of ${contactsResponse.total}`);

    this.setState(state => ({
      contacts: (state.contacts ? [...state.contacts, ...contacts] : contacts),
      contactsPage: state.contactsPage + 1,
      contactsFinished: contactsResponse.hasNextPage === 1,
      contactsTotal: contactsResponse.total,
    }), () => {
      // on state update, pull more contacts
      this._getContacts();
    });
  }

  _selectContact = (contact: Contact) => {
    const { navigation } = this.props;

    if (!(navigation && navigation.state && navigation.state.params && navigation.state.params.onSelect)) {
      console.log('no onSelect available for contactview, skipping;');
      return;
    }

    navigation.state.params.onSelect(contact);
    navigation.goBack();
  }

  _updateQuery = (query: string) => {
    console.log('_updateQuery>', query);
    this.setState({ searchQuery: query });

    if (!query) {
      this.setState({ contactsSearchResults: null });
      return;
    }

    console.log('pre debounce>', query);
    this._searchContactsDebounced(query);
  }

  _searchContacts = (query: string) => {
    const allContacts = this.state.contacts;

    if (!allContacts) {
      console.log('contacts not available');
      return;
    }

    const timeStart = new Date().getTime();

    const filteredContacts = allContacts
      .filter((contact: Contact) => {
        // console.log(`\t${contact.name} includes ${query}`);
        contact.name.includes(query)
      }
    );

    const timeEnd = new Date().getTime();

    console.log('filter done>', query, `${timeEnd - timeStart}ms`, filteredContacts.length);

    this.setState({
      contactsSearchResults: filteredContacts
    });
  }

  _searchContactsDebounced = debounce(this._searchContacts, SEARCH_DEBOUNCE_TIME_MS)

  renderContacts() {
    const contacts = this.state.contactsSearchResults || this.state.contacts;

    if (!Array.isArray(contacts)) {
      return null;
    }

    if (contacts.length === 0) {
      return (
        <List.Item
          key={'no results'}
        >
          <List.Item.Brief>No results.</List.Item.Brief>
        </List.Item>
      );
    }

    return contacts.map((contact : Contact) =>
      <List.Item
        key={contact.id}
        extra={'Select'}
        arrow="horizontal"
        onClick={() => this._selectContact(contact)}
        onLongPress={() => alert('hello ' + contact.id)}
      >
        {contact.name}

        {contact.phoneNumbers.length > 0 && <List.Item.Brief>{contact.phoneNumbers[0].digits}</List.Item.Brief>}
      </List.Item>
    );
  }

  render() {
    return (
      <ScrollView style={styles.fullWidth}>
        <SearchBar
          placeholder="Search"
          value={this.state.searchQuery}
          onChange={value => this._updateQuery(value)}
        />

        <List renderHeader={() =>
          this.state.searchQuery
            ? `Search results for "${this.state.searchQuery}"`
            : `Select a ${this.props.navigation.state.params.contactLabel || 'contact'}`
        }>
          {this.renderContacts()}
        </List>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    flex: 1,
    width: '100%'
  },
});
