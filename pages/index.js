import React from 'react'
import io from 'socket.io-client'
import JSONTree from 'react-json-tree'
import Form from 'react-jsonschema-form'

const theme = {
  scheme: 'monokai',
  author: 'wimer hazenberg (http://www.monokai.nl)',
  base00: '#272822',
  base01: '#383830',
  base02: '#49483e',
  base03: '#75715e',
  base04: '#a59f85',
  base05: '#f8f8f2',
  base06: '#f5f4f1',
  base07: '#f9f8f5',
  base08: '#f92672',
  base09: '#fd971f',
  base0A: '#f4bf75',
  base0B: '#a6e22e',
  base0C: '#a1efe4',
  base0D: '#66d9ef',
  base0E: '#ae81ff',
  base0F: '#cc6633'
}

const schemaAuthSuccess = {
  title: 'Authorize successful response',
  type: 'object',
  properties: {
    status: {
      type: 'string',
      title: 'status',
      default: 'SUCCESS'
    },
    pin: {
      type: 'string',
      title: 'pin',
      default: '02913f7f-d3a3-11e3-9e62-3cd92b799b27'
    },
    externalRequestId: {
      type: 'string',
      title: 'externalRequestId',
      default: 'ac12345'
    },
    errorCode: {
      type: 'string',
      title: 'errorCode',
      default: 'ExternalRequestId ac12345 already exists'
    }
  }
}

class HomePage extends React.Component {
  // fetch old messages data from the server
  static async getInitialProps ({ req }) {
    return {}
  }

  static defaultProps = {
    messages: []
  }

  // init state with the prefetched messages
  state = {
    field: '',
    messages: this.props.messages,
    requestJson: null
  }

  // connect to WS server and listen event
  componentDidMount () {
    this.socket = io()
    this.socket.on('request', this.handleInComingRequest)
  }

  // close socket connection
  componentWillUnmount () {
    this.socket.off('message', this.handleMessage)
    this.socket.close()
  }

  handleInComingRequest = (requestBody) => {
    this.setState(state => ({ requestJson: requestBody }))
  }

  sendResponse = form => {
    if (this.state.requestJson !== null) {
      this.socket.emit('response', form.formData)
    }
  }

  render () {
    return (
      <main>
        <div>
          <label>Request body JSON:</label>
          {this.state.requestJson !== null
            ? <JSONTree data={this.state.requestJson} theme={theme} invertTheme={false} />
            : <div>No Request yet</div>
          }
        </div>
        <div>
          <label>Response body builder:</label>
          <Form
            schema={schemaAuthSuccess}
            onSubmit={this.sendResponse}
          />
        </div>
      </main>
    )
  }
}

export default HomePage
