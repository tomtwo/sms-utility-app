import React from 'react';
import { StackNavigator } from 'react-navigation';

import HomeView from './components/HomeView';
import SelectContactView, { ContactView } from './components/SelectContactView';
import SpoofSMSView from './components/SpoofSMSView';
import TestView from './components/TestView';

const AppRouter = StackNavigator({
  SpoofSMS: { screen: SpoofSMSView },
  Home: { screen: HomeView },
  SelectContact: { screen: SelectContactView },
  Contact: { screen: ContactView },
  Tests: { screen: TestView },
});

export default AppRouter;
