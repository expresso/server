import http from 'http'
const env = require('sugar-env')
const cfonts = require('cfonts')
import merge from 'lodash.merge'
import { Express } from 'express'

export interface IServerConfig {
  name: string
  server?: {
    printOnListening?: boolean
    binding?: {
      ip: string
      port: number
    }
  }
}

type Filled<T> = {
  [P in keyof T]-?: Filled<T[P]>
}

export interface IExpressoAppFactory<TConfig extends IServerConfig> {
  (options: TConfig, environment: string): Promise<Express>
}

export interface IServerTransformer {
  (server: http.Server, config: Required<IServerConfig>): Promise<void>
}

export async function start<TConfig extends IServerConfig> (appFactory: IExpressoAppFactory<TConfig>, options: TConfig, serverTransformer?: IServerTransformer) {
  const config: Filled<IServerConfig> & TConfig = merge(
    { server: { printOnListening: true } },
    { server: { binding: { ip: env.get('SERVER_BINDING_IP', 'HOST', '0.0.0.0') } } },
    { server: { binding: { port: parseInt(env.get('SERVER_BINDING_PORT', 'PORT', 3000), 10) } } },
    options
  )

  const server = http.createServer(await appFactory(config, env.current))

  if (serverTransformer) await serverTransformer(server, config)

  server.on('listening', () => {
    const addr = server.address()

    if (!addr) return console.log('Server is listening on unknown address')

    cfonts.say('expresso', {
      font: 'simple3d',
      colors: ['green'],
      letterSpacing: 0,
      align: 'center',
      space: false,
      lineHeight: 0
    })

    const address = typeof addr === 'string'
      ? addr
      : `${addr.address}:${addr.port}`

    const { string: name } = cfonts.render(config.name, { font: 'console', colors: ['green'] })
    const { string: info } = cfonts.render(`${config.name} server listening at http://${address}`, {
      font: 'console',
      align: 'center',
      lineHeight: 1
    })

    console.log(info.replace(config.name, name.trim()))
  })

  server.listen(config.server.binding.port, config.server.binding.ip)
}

export default { start }
