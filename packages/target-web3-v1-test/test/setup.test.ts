import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinonChai from 'sinon-chai'
import chaiHttp from 'chai-http'
import chaiSubset from 'chai-subset'

chai.use(chaiAsPromised)
chai.use(sinonChai)
chai.use(chaiHttp)
chai.use(chaiSubset)
