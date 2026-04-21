"""Simple dev server that serves index.html for any path (SPA-style routing)."""
import http.server
import os

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))


class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        # Serve actual files (css, js, images) normally
        file_path = os.path.join(DIRECTORY, self.path.lstrip('/'))
        if os.path.isfile(file_path):
            return super().do_GET()
        # Everything else gets index.html (so /John serves the page)
        self.path = '/index.html'
        return super().do_GET()


if __name__ == '__main__':
    with http.server.HTTPServer(('', PORT), SPAHandler) as httpd:
        print(f'Serving at http://localhost:{PORT}')
        print(f'Try: http://localhost:{PORT}/John')
        httpd.serve_forever()
