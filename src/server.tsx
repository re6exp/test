import path from 'path'
import React from 'react'
import express from 'express'
import { html as htmlTemplate, oneLineTrim } from 'common-tags'
import { renderToString } from 'react-dom/server'
import { ChunkExtractor, ChunkExtractorManager } from '@loadable/server'

import { findUsers } from './data'
import App from './App'

const server = express()

server
	.disable('x-powered-by')
	.use(
		express.static(
			process.env.RAZZLE_PUBLIC_DIR ? process.env.RAZZLE_PUBLIC_DIR : ''
		)
	)
	.use(express.json())

	.post('/users', async (req, res) => {
		const query = req.body
		if (Object.keys(query).length) {
			const result = await findUsers(req.body)
			console.log(
				`/user: JSON.stringify(result):${JSON.stringify(result)}`
			)
			res.json(result)
			res.end()
		} else {
			res.json([])
		}
	})

	.get('/*', (req, res) => {
		const extractor = new ChunkExtractor({
			statsFile: path.resolve('build/loadable-stats.json'),
			entrypoints: ['client']
		})

		const html = renderToString(
			<ChunkExtractorManager extractor={extractor}>
				<App />
			</ChunkExtractorManager>
		)

		res.status(200).send(
			oneLineTrim(htmlTemplate`
      <!doctype html>
      <html lang="">
        <head>
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta charSet='utf-8' />
          <title>Search users in  &lt;https://reqres.in/&gt; replica</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          ${extractor.getLinkTags()}
		  ${extractor.getStyleTags()}
		  <style>
		    body {
			  margin: 0;
			  padding: 0;
			  font-family: sans-serif;
		    }
		  </style>
        </head>
        <body>
          <div id="root">${html}</div>
          ${extractor.getScriptTags()}
        </body>
      </html>
    `)
		)
	})

export default server
