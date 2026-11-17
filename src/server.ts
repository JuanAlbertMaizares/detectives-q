import Fastify, { FastifyError } from 'fastify'
import { jsonSchemaTransform, serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod'
import { characterRoutes } from './routes/characterRoutes.js'
import { caseRoutes } from './routes/caseRoutes.js'

import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'


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

// swagger y s-ui
await app.register(swagger, {
  openapi: {
    info: {
      title: 'Detectives-Q API',
      description: 'Documentación oficial de la API del universo de Detectives Q',
      version: '1.0.0',
    },
  },
  // ESTA ES LA LÍNEA CLAVE:
  transform: jsonSchemaTransform, 
})

// 2. Configurar la interfaz visual (Swagger UI)
await app.register(swaggerUi, {
  routePrefix: '/docs', // La documentación estará en http://localhost:3000/docs
})


// Registrar rutas
app.get('/health', async () => {
  return { status: 'ok', message: 'Detectives-Q API funcionando' }
})

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