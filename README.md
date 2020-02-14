# Metamask Checker &mdash; Vue

[![License](https://img.shields.io/badge/License-MIT-000000.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/LordotU/vue-metamask-checker.svg?branch=master)](https://travis-ci.org/LordotU/vue-metamask-checker)
[![Coverage Status](https://coveralls.io/repos/github/LordotU/vue-metamask-checker/badge.svg)](https://coveralls.io/github/LordotU/vue-metamask-checker)

## [Live demo](https://vue-metamask-checker-demo-with-parcel.lordotu.now.sh)

## Description

Vue component which uses [Scoped Slots](https://vuejs.org/v2/guide/components-slots.html#Scoped-Slots) for checking [Metamask](https://metamask.io/) inpage provider object.

**Note**: only new version of Metamask API is supported. Related links:
  * https://medium.com/metamask/breaking-changes-to-the-metamask-inpage-provider-b4dde069dd0a
  * https://metamask.github.io/metamask-docs/API_Reference/Ethereum_Provider#new-api

## Installation

```bash
yarn add @metamask-checker/vue

# or

npm install --save @metamask-checker/vue
```

## Testing

```bash
yarn test:jest # Runs Jest with coverage collection
yarn test:coverage # Sends coverage to .coveralls.io
yarn test # yarn test:jest && yarn test:coverage

# or

npm run test:jest
npm run test:coverage
npm test
```

## Usage

```vue
<!-- ./src/App.vue -->

<template>
  <MetamaskChecker
    <!-- -->
    <!--:account="null"-->
    <!--:network="null"-->
    <!--:onCheckError="(error) => null"-->
    <!--:onCheckSuccess="(provider, account, network) => null"-->
  >
    <div id="err" slot="errored" slot-scope="{ error }">
      {{ error.message || 'Unexpected error' }}
    </div>

    <div id="app" slot="checked" slot-scope="{ provider, selectedAccount, selectedNetwork }">
      Selected account {{ selectedAccount }} in selected network {{ selectedNetwork }}
    </div>

    <div id="loader">
      Loader...
    </div>
  </MetamaskChecker>
</template>

<script>
  import MetamaskChecker from '@metamask-checker/vue'

  export default {
    components: {
      MetamaskChecker,
    },
  }
</script>
```
