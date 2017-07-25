// @flow

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'antd-mobile';
import { Fingerprint } from 'expo';

import type { Contact } from '../types';

export default class TestView extends React.Component {
  static navigationOptions = {
    title: 'Test View'
  }

  state = {
    fingerprintStatus: null,
  }

  _selectContact : () => Promise<Contact> = (contactLabel) => {
    return new Promise(resolve => {
      this.props.navigation.navigate('SelectContact', {
        contactLabel,
        onSelect: (contact: Contact) => resolve(contact)
      });
    });
  }

  _testSelectContact = async () => {
    const contact = await this._selectContact('test subject');

    console.log('got test subject>>', contact);
  }

  _launchFingerprint = async () => {
    const hasFingerprint = await Fingerprint.hasHardwareAsync();

    if (!hasFingerprint) {
      alert('no fingerprint available.');
      return;
    }

    const { success } = await Fingerprint.authenticateAsync('test ask fingerprint');

    console.log('has>', hasFingerprint, 'test>', success);
    this.setState({ fingerprintStatus: success });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Here is a test view!</Text>
        <Text>Some other text.</Text>
        <Text>is this shit turned on?!</Text>

        <Button
          onClick={this._launchFingerprint}
        >
          {this.state.fingerprintStatus === true && '✅'}
          {this.state.fingerprintStatus === false && '❎'}
          Test Fingerprint
        </Button>

        <Button
          onClick={this._testSelectContact()}
        >
          Test select contact
        </Button>
      </View>
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
});
