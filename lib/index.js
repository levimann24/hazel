// Packages
const Router = require('router')
const finalhandler = require('finalhandler')
const Cache = require('./cache')

module.exports = config => {
  const router = Router()
  let productionCache = null;
  let developmentCache = null;

  try {
    // Production cache (stable releases only)
    productionCache = new Cache({
      ...config,
      channel: 'production'
    })
    
    // Development cache (pre-releases only)
    developmentCache = new Cache({
      ...config,
      channel: 'development'
    })
  } catch (err) {
    const { code, message } = err

    if (code) {
      return (req, res) => {
        res.statusCode = 400;

        res.end(JSON.stringify({
          error: {
            code,
            message
          }
        }))
      }
    }

    throw err
  }

  const productionRoutes = require('./routes')({ cache: productionCache, config: { ...config, channel: 'production' } })
  const developmentRoutes = require('./routes')({ cache: developmentCache, config: { ...config, channel: 'development' } })

  // Production endpoints
  router.get('/production', productionRoutes.overview)
  router.get('/production/download', productionRoutes.download)
  router.get('/production/download/:platform', productionRoutes.downloadPlatform)
  router.get('/production/update/:platform/:version', productionRoutes.update)
  router.get('/production/update/win32/:version/RELEASES', productionRoutes.releases)

  // Development endpoints
  router.get('/dev', developmentRoutes.overview)
  router.get('/dev/download', developmentRoutes.download)
  router.get('/dev/download/:platform', developmentRoutes.downloadPlatform)
  router.get('/dev/update/:platform/:version', developmentRoutes.update)
  router.get('/dev/update/win32/:version/RELEASES', developmentRoutes.releases)

  // Legacy endpoints (default to production)
  router.get('/', productionRoutes.overview)
  router.get('/download', productionRoutes.download)
  router.get('/download/:platform', productionRoutes.downloadPlatform)
  router.get('/update/:platform/:version', productionRoutes.update)
  router.get('/update/win32/:version/RELEASES', productionRoutes.releases)

  return (req, res) => {
    router(req, res, finalhandler(req, res))
  }
}
