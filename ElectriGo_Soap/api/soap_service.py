from spyne import Application, rpc, ServiceBase, \
    Integer, Unicode , Decimal, Boolean
from spyne import Iterable
from spyne.protocol.soap import Soap11
from spyne.server.wsgi import WsgiApplication
import decimal
from wsgiref.simple_server import make_server

class SoapService(ServiceBase):
    @rpc(Decimal, Decimal, Decimal, _returns=Decimal)
    def calculDuree(ctx, distance, vitesse_moyenne, nb_stops):
        ctx.transport.resp_headers['Access-Control-Allow-Origin'] = '*'
        return (distance / vitesse_moyenne) + nb_stops

application = Application([SoapService], 'spyne.electrigo.duree.soap',
        in_protocol=Soap11(validator='lxml'),
        out_protocol=Soap11())
wsgi_application = WsgiApplication(application)

app = wsgi_application
server = make_server('localhost', 8000, wsgi_application)
server.serve_forever()
