<template>
  <div>
    <slot
      v-if="isErrored"
      name="errored"
      :error="error"
    />
    <slot
      v-else-if="isChecked"
      name="checked"
      :provider="provider"
      :selectedAccount="selectedAccount"
      :selectedNetwork="selectedNetwork"
    />
    <slot v-else />
  </div>
</template>

<script>
  import checkMetamask, { MetamaskNotFoundError } from '@metamask-checker/core'


  export default {
    name: 'MetamaskChecker',

    props: {
      account: {
        type: String,
        default: null,
        validator: value => (
          [undefined, null, false].includes(value) ||
          /^(0x)?[0-9a-f]{40}$/i.test(value)
        ),
      },
      network: {
        type: Number,
        default: null,
      },

      onCheckError: {
        type: Function,
        default: () => {},
      },
      onCheckSuccess: {
        type: Function,
        default: () => {},
      },
    },

    data () {
      return {
        selectedNetwork: undefined,
        selectedAccount: undefined,

        isChecked: false,

        isErrored: false,
        error: null
      }
    },

    created () {
      this.provider = null
      this.account = null
    },

    beforeMount () {
      window.addEventListener('load', this.check)
    },

    beforeDestroy () {
      this.removeProviderListeners()
      window.removeEventListener('load', this.check)
    },

    methods: {
      addProviderListeners () {
        this.provider
          .on('networkChanged', this.check)
          .on('accountsChanged', this.check)
      },

      removeProviderListeners () {
        (this.provider || { off: function () { return this }})
          .off('networkChanged', this.check)
          .off('accountsChanged', this.check)
      },

      async check ()  {
        let result = {}
        let resultError = null

        try {

          result = (await checkMetamask(
            window.ethereum,
            this.network,
            this.account,
          ))

        } catch (error) {

          console.error (error)

          resultError = error

        } finally {

          if (! (resultError instanceof MetamaskNotFoundError)) {
            this.provider = window.ethereum

            this.removeProviderListeners()
            this.addProviderListeners()
          }

          if (resultError) {
            await this.onCheckError(resultError)
          } else {
            await this.onCheckSuccess(
              this.provider,
              result.selectedAccount,
              result.selectedNetwork,
            )
          }

          this.selectedAccount = result.selectedAccount
          this.selectedNetwork = result.selectedNetwork
          this.isChecked = !!! resultError
          this.isErrored = !! resultError
          this.error = resultError

        }
      }
    },

  }
</script>
