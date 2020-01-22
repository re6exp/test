/* eslint-disable no-console, global-require */

import http from 'http'
import cron from 'node-cron'

import { syncSrcAndTarget } from './data'

let app = require('./server').default

const server = http.createServer(app)

let currentApp = app

async function syncStorages() {
  await syncSrcAndTarget()
  console.log(`Data synchronized with the source at ${new Date().toLocaleDateString('ru-RU', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })}`)
}

server.listen(process.env.PORT || 3000, () => {
  console.log('🚀 started')

  const job = cron.schedule(
    '* * * * *',
    syncStorages
  )
  job.start()

})
  .on("error", console.error)

if (module.hot) {
  console.log('✅  Server-side HMR Enabled!')

  module.hot.accept('./server', () => {
    console.log('🔁  HMR Reloading `./server`...')

    try {
      app = require('./server').default
      server.removeListener('request', currentApp)
      server.on('request', app)
      currentApp = app
    } catch (error) {
      console.error(error)
    }
  })
}