import Fastify, { FastifyError } from 'fastify'
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod'
import { characterRoutes } from './routes/characterRoutes.js'
import { caseRoutes } from './routes/caseRoutes.js'

const app = Fastify({
  logger: true,
}).withTypeProvider<ZodTypeProvider>()

// Configurar Zod para validar y serializar
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

// Manejo global de errores
// 2. Tipamos 'error' como FastifyError
app.setErrorHandler((error: FastifyError, request, reply) => {
  // Si el error viene de la validación de Zod, devolvemos 400 (Bad Request)
  if (error.validation) {
    return reply.status(400).send({
      error: 'Error de validación',
      details: error.validation,
    })
  }
 
  // Logueamos el error en la consola de Fastify
  app.log.error(error)

  // Errores internos
  return reply.status(500).send({ error: 'Error interno del servidor' })
})

// Ruta de salud
app.get('/health', async () => {
  return { status: 'ok', message: 'Detectives-Q API funcionando' }
})

// Registrar rutas
app.register(characterRoutes, { prefix: '/characters' })

app.register(caseRoutes, { prefix: '/cases' })


// 1. EXPORTAMOS la app para que los tests puedan usarla
export { app }

// 2. CREAMOS la función start
const start = async () => {
  try {
    await app.listen({ port: 3000, host: '0.0.0.0' })
    console.log('🚀 Servidor corriendo en http://localhost:3000')
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

// 3. SOLO ARRANCAMOS el servidor si NO estamos en entorno de test
if (process.env.NODE_ENV !== 'test') {
start()
}