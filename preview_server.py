from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).parent
class SPAHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)
    def send_head(self):
        path = Path(urlparse(self.path).path.lstrip('/'))
        if path.parts and path.parts[0] not in {'data','src','public'} and not (ROOT / path).exists():
            body = (ROOT / 'index.html').read_bytes()
            self.send_response(200)
            self.send_header('Content-Type','text/html; charset=utf-8')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            return __import__('io').BytesIO(body)
        return super().send_head()

if __name__ == '__main__':
    ThreadingHTTPServer(('0.0.0.0', 3000), SPAHandler).serve_forever()
