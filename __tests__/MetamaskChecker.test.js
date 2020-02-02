import { mount } from '@vue/test-utils'
import MetamaskChecker from '../src'


describe('MetamaskChecker', () => {

  it('renders default slot when nothing happens', async () => {
    const wrapper = mount(MetamaskChecker, {
      slots: {
        default: '<div id="loader">Loader</div>',
      }
    })
    console.log(wrapper.html())
    // expect(wrapper.findAll('li')).toHaveLength(items.length)
  })

})
