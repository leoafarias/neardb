import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

// This sets the mock adapter on the default instance
const mock = new MockAdapter(axios)

let data = {
  firstValue: 3,
  secondValue: 'String'
}

mock.onGet().reply(200, data)

export default mock
