import * as ngPackage from 'ng-packagr'

ngPackage
  .ngPackagr()
  .forProject('./package.json')
  .withTsConfig('tsconfig.lib.json')
  .build()
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
