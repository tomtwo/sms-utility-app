# sms-utility-app

React Native client for sending spoof SMS using [sms-utility-api](https://github.com/tomtwo/sms-utility-api).

## Installation
```
# install dependencies
yarn # or npm install

# add URL for deployed sms-utility-api to .env
echo "API_URL=http://localhost:3000\nAPI_KEY=not_in_use" > .env
```

## Development

- Preferred: use [XDE](https://github.com/expo/xde).
- Alternatively: `npm run start`

## dotenv support

Configuration is loaded from `.env` using `react-native-dotenv`. Create a `.env` file, populate with `KEY=VAL` entries, then use `import { KEY } from 'react-native-dotenv` (not `process.env`!). Variables are inlined at build time.

## create-react-native-app

This project was bootstrapped with [Create React Native App](https://github.com/react-community/create-react-native-app). You can see the original guide for CRNA [here](https://github.com/react-community/create-react-native-app/blob/master/react-native-scripts/template/README.md).
