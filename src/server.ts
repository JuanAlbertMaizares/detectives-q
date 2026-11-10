import Fastify from 'fastify'
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod'
import { characterRoutes } from './routes/characterRoutes.js'

const app = Fastify({
  logger: true,
}).withTypeProvider<ZodTypeProvider>()

// Configurar Zod para validar y serializar
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

// Ruta de salud
app.get('/health', async () => {
  return { status: 'ok', message: 'Detectives-Q API funcionando' }
})

// Registrar rutas
app.register(characterRoutes, { prefix: '/characters' })

const start = async () => {
  try {
    await app.listen({ port: 3000, host: '0.0.0.0' })
    console.log('🚀 Servidor corriendo en http://localhost:3000')
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()