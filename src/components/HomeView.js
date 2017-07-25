// @flow

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'antd-mobile';

import type { Contact } from '../types';

const SKIP_FINGERPRINT = true;

export default class HomeView extends React.Component {
  static navigationOptions = {
    title: 'SMS Utility',
    headerLeft: () => <Text>Hello</Text>
  }

  _gotoSpoofSMS = () => {
    this.props.navigation.navigate('SpoofSMS');
  }

  _gotoTests = () => {
    this.props.navigation.navigate('Tests');
  }

  render() {
    return (
      <View style={styles.container}>
        <Button
          onClick={this._gotoSpoofSMS}
        >
          Go to spoof sms
        </Button>

        <Button
          onClick={this._gotoTests}
        >
          Go to test view
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
