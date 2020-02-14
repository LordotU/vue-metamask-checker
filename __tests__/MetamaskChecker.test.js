import { mount } from '@vue/test-utils'

import MetamaskInpageProvider from './__mocks__/MetamaskInpageProvider'

import MetamaskChecker from '../src'

const flushPromises = () => new Promise(resolve => setImmediate(resolve))

describe('MetamaskChecker', () => {

  const defaultSlot = '<div id="loader">Loader</div>'
  const erroredSlot = `<div id="err" slot-scope="{ error }">{{ error.message || 'Unexpected error' }}</div>`
  const checkedSlot = `
    <div id="app" slot-scope="{ provider, selectedAccount, selectedNetwork }">
      Selected account {{ selectedAccount }} in selected network {{ selectedNetwork }}
    </div>
  `

  const NETWORK = 0x01
  const ACCOUNT = '0x1111111111111111111111111111111111111111'

  beforeEach(async () => {
      window.ethereum = new MetamaskInpageProvider({
          network  : NETWORK,
          accounts : [ACCOUNT]
      })
  })

  const checkedText = `Selected account ${ACCOUNT} in selected network ${NETWORK}`

  it('throws an error when default slot not specified', async () => {
    expect(() => mount(MetamaskChecker)).toThrowError('Cannot determine slot for rendering!')

    expect(() => mount(MetamaskChecker, {
      scopedSlots: {
        errored: erroredSlot,
      },
    })).toThrowError('Cannot determine slot for rendering!')
    expect(() => mount(MetamaskChecker, {
      scopedSlots: {
        checked: checkedSlot,
      },
    })).toThrowError('Cannot determine slot for rendering!')
    expect(() => mount(MetamaskChecker, {
      scopedSlots: {
        errored: erroredSlot,
        checked: checkedSlot,
      },
    })).toThrowError('Cannot determine slot for rendering!')
  })

  it('renders "default" slot when nothing happens and destroys normally', async () => {
    const wrapper = mount(MetamaskChecker, {
      scopedSlots: {
        errored: erroredSlot,
        checked: checkedSlot,
      },
      slots: {
        default: defaultSlot,
      },
    })

    expect(wrapper.contains('[id="loader"]')).toBe(true)

    wrapper.destroy()
  })

  it('renders "errored" slot when something wrong with MetamaskInpageProvider', async () => {
    const wrapper = mount(MetamaskChecker, {
      scopedSlots: {
        errored: erroredSlot,
        checked: checkedSlot,
      },
      slots: {
        default: defaultSlot,
      },
    })

    window.ethereum = null
    await flushPromises()
    window.dispatchEvent(new Event('load'))
    await flushPromises()

    expect(wrapper.find('[id="err"]').text()).toBe(`Can't find ethereum provider object!`)
  })

  it('renders "errored" slot when something wrong with given network', async () => {
    const wrapper = mount(MetamaskChecker, {
      propsData: {
        network: 0,
      },
      scopedSlots: {
        errored: erroredSlot,
        checked: checkedSlot,
      },
      slots: {
        default: defaultSlot,
      },
    })

    await flushPromises()
    window.dispatchEvent(new Event('load'))
    await flushPromises()

    expect(wrapper.find('[id="err"]').text()).toBe(`Metamask's selected network is not the same as given (0)!`)
  })

  it('renders "errored" slot when something wrong with given account', async () => {
    const wrapper = mount(MetamaskChecker, {
      propsData: {
        account : '0x0000000000000000000000000000000000000000',
      },
      scopedSlots: {
        errored: erroredSlot,
        checked: checkedSlot,
      },
      slots: {
        default: defaultSlot,
      },
    })

    await flushPromises()
    window.dispatchEvent(new Event('load'))
    await flushPromises()

    expect(wrapper.find('[id="err"]').text()).toBe(`Metamask's selected account is not the same as given (0x0000000000000000000000000000000000000000)!`)
  })

  it('renders "checked" slot when all ok with MetamaskInpageProvider', async () => {
    const wrapper = mount(MetamaskChecker, {
      scopedSlots: {
        errored: erroredSlot,
        checked: checkedSlot,
      },
      slots: {
        default: defaultSlot,
      },
    })

    await flushPromises()
    window.dispatchEvent(new Event('load'))
    await flushPromises()

    expect(wrapper.find('[id="app"]').text()).toBe(checkedText)
  })

  it('renders "checked" slot when all ok with MetamaskInpageProvider, given network and account', async () => {
    const wrapper = mount(MetamaskChecker, {
      propsData: {
        network : NETWORK,
        account : ACCOUNT,
      },
      scopedSlots: {
        errored: erroredSlot,
        checked: checkedSlot,
      },
      slots: {
        default: defaultSlot,
      },
    })

    await flushPromises()
    window.dispatchEvent(new Event('load'))
    await flushPromises()

    expect(wrapper.find('[id="app"]').text()).toBe(checkedText)
  })
})
