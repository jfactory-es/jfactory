import { afterAll, afterEach, beforeAll } from 'vitest'
import { setupServer } from 'msw/node'
import { rest } from 'msw'

export const restHandlers = [
    rest.get('https://api.test.local/asset.txt', function(req, res, ctx) {
        return res(ctx.status(200), ctx.text("Hello world!"))
    }),
    rest.get('https://api.test.local/asset.json', function(req, res, ctx) {
        return res(ctx.status(200), ctx.json({
            data1: 123,
            data2: 456
        }))
    }),
    rest.get('https://api.test.local/asset.html', function(req, res, ctx) {
        return res(ctx.status(200), ctx.text("<p class=\"jFactory-test\">Hello world!</p>"))
    }),
    rest.get('https://api.test.local/asset.css', function(req, res, ctx) {
        return res(ctx.status(200), ctx.text("#dom1 {visibility: hidden;}"))
    })
]

const server = setupServer(...restHandlers)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())