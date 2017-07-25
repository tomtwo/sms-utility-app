// @flow

import React from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput } from 'react-native';
import { Button, List, InputItem, Modal } from 'antd-mobile';

import type { Contact } from '../types';
import { sendSMSMessage } from '../utils';

export default class SpoofSMSView extends React.Component {
  static navigationOptions = {
    title: 'Spoof SMS'
  }

  state : {
    sender: string,
    senderName: ?string,
    receiver: string,
    receiverName: ?string,
    content: string,
    sending: bool,
    sent: bool,
    error: ?string,
    cost: ?string,
    balance: ?string,
  } = {
    sender: '',
    senderName: null,
    receiver: '',
    receiverName: null,
    content: '',
    sending: false,
    sent: false,
    error: null,
    cost: null,
    balance: null,
  }

  _selectContact : () => Promise<Contact> = (contactLabel) => {
    return new Promise(resolve => {
      this.props.navigation.navigate('SelectContact', {
        contactLabel,
        onSelect: (contact: Contact) => resolve(contact)
      });
    });
  }

  _suggestSenderContact = async () => {
    const contact = await this._selectContact('sender');

    this.setState({
      sender: contact.phoneNumbers[0].digits,
      senderName: contact.name,
    });
  }

  _suggestReceiverContact = async () => {
    const contact = await this._selectContact('receiver');

    this.setState({
      receiver: contact.phoneNumbers[0].digits,
      receiverName: contact.name,
    });
  }

  _send = async () => {
    const { sender, receiver, content } = this.state;

    if (!sender || !receiver || !content) {
      alert('missing fields');
      return;
    }

    const didConfirm = await new Promise(resolve => {
      Modal.alert('Send SMS?', `${sender} to ${receiver}`, [
        { text: 'Cancel', onPress: () => resolve(false), style: 'default' },
        { text: 'OK', onPress: () => resolve(true), style: { fontWeight: 'bold' } },
      ]);
    });

    if (!didConfirm) {
      return;
    }

    this.setState({ sending: true, sent: false, error: null, cost: null });
    const res = await sendSMSMessage(sender, receiver, content);

    if (!res.success) {
      this.setState({ sending: false, sent: false, error: res.message });
      return;
    }

    try {
      this.setState({ sending: false, sent: true, cost: res.data.messages[0]['message-price'], balance: res.data.messages[0]['remaining-balance'] });
    } catch (ex) {
      this.setState({ sending: false, sent: true });
    }
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <List
          style={styles.list}
          renderHeader={() => 'MESSAGE INFO'}
        >
          <InputItem
            type="numbers-and-punctuation"
            clear
            placeholder="# of sender"
            value={this.state.sender}
            onChange={value => this.setState({ sender: value })}
            extra={
              this.state.senderName
                ? <Button size="small" onClick={() => this.setState({ senderName: null })}>{this.state.senderName.split(' ')[0]}</Button>
                : <Button size="small" onClick={this._suggestSenderContact}>📖</Button>
            }
          >Sender</InputItem>
          <InputItem
            type="numbers-and-punctuation"
            clear
            placeholder="# of receiver"
            value={this.state.receiver}
            onChange={value => this.setState({ receiver: value })}
            extra={
              this.state.receiverName
                ? <Button size="small" onClick={() => this.setState({ receiverName: null })}>{this.state.receiverName.split(' ')[0]}</Button>
                : <Button size="small" onClick={this._suggestReceiverContact}>📖</Button>
            }
          >Receiver</InputItem>
        </List>

        <List
          style={styles.list}
          renderHeader={() => 'MESSAGE CONTENT'}
        >
          <List.Item
          >
            <TextInput
              style={styles.textarea}
              multiline
              numberOfLines={5}
              placeholder="type sms content here.."
              value={this.state.content}
              onChangeText={value => this.setState({ content: value })}
            />
          </List.Item>
        </List>

        <List
          style={styles.list}
          renderHeader={() => ''}
        >
          <List.Item>
            <Button
              type="primary"
              onClick={this._send}
              disabled={this.state.sending}
              loading={this.state.sending}
            >Send</Button>
          </List.Item>
        </List>

        {this.state.sent && <Text style={styles.statusText}>Message sent successfully!</Text>}
        {this.state.cost && <Text style={styles.statusText}>Cost: ${parseFloat(this.state.cost).toFixed(4)}</Text>}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  list: {
    width: '100%',
  },
  textarea: {
    fontSize: 15,
    minHeight: 50,
    maxHeight: 100,
  },
  statusText: {
    textAlign: 'center',
    marginTop: 10,
    color: '#aaa',
  },
});
