import React from 'react'
import loadable, { LoadableComponent } from '@loadable/component'

const Spinner = loadable(() => import('./spinner'))

const FindUser: LoadableComponent<any> = loadable(() => import('./find'), {
	fallback: <Spinner />
})

const App = () => <FindUser path='/' />

export default App
