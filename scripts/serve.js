import 'config/environment'
import '~/scripts/helpers/cssModulesHook'
import http from 'http'
import koa from 'koa'
import serve from 'koa-static'
import mount from 'koa-mount'
import debug from 'debug'
import { ROOT, STATIC, SERVER, SOCKETS } from 'config/paths'
import { isomorphicTools } from 'server/isomorphicTools'
import addMiddleware from 'server/addMiddleware'

const log = {
  app: debug('app'),
}

const app = koa()
app.keys = [ 'd0n7', '7311', '4ny0n3' ]
addMiddleware(app)
app.use(serve(STATIC))

isomorphicTools.server(ROOT, () => {
  app.use(function *() {
    const { routerApp, setRoutes } = require(`${SERVER}/router`)
    setRoutes(isomorphicTools.assets())
    yield mount(routerApp)
  })
})

const server = http.createServer(app.callback())
global.socketServer = require(SOCKETS)(server)

server.listen(process.env.PORT, () => {
  log.app(`http://localhost:${process.env.PORT}`)
})
