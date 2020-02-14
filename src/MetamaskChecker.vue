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
      this.$provider = null
      this.$account = null
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
        this.$provider
          .on('networkChanged', this.check)
          .on('accountsChanged', this.check)
      },

      removeProviderListeners () {
        (this.$provider || { off: function () { return this }})
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
            this.$provider = window.ethereum

            this.removeProviderListeners()
            this.addProviderListeners()
          }

          if (resultError) {
            await this.onCheckError(resultError)
          } else {
            await this.onCheckSuccess(
              this.$provider,
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

    render (h) {
      const isComponent = vnode => !! vnode.componentOptions

      let $slot

      try {
        [$slot] = this.$slots.default
          .filter(vnode => isComponent(vnode) || vnode.tag || !! vnode.text.trim())

        if (this.isErrored) {
          [$slot] = this.$scopedSlots.errored({
            error: this.error,
          })
        } else if (this.isChecked) {
          [$slot] = this.$scopedSlots.checked({
            provider: this.$provider,
            selectedAccount: this.selectedAccount,
            selectedNetwork: this.selectedNetwork,
          })
        }
      } catch (error) {
        console.error(error)
      }

      if (! $slot) {
        throw new Error('Cannot determine slot for rendering!')
      }

      const elm = isComponent($slot)
        ? $slot.componentOptions.Ctor
        : $slot.tag

      const props = isComponent($slot)
        ? $slot.componentOptions.propsData
        : {}

      const children = isComponent($slot)
        ? $slot.componentOptions.children
        : $slot.children

      return h(
        elm,
        {
          ...$slot.data,
          props,
        },
        children,
      )

    },

  }
</script>
