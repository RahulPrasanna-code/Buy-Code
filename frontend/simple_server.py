from http.server import HTTPServer,SimpleHTTPRequestHandler

def run(server_class=HTTPServer, handler_class=SimpleHTTPRequestHandler):
    """Entrypoint for python server"""
    server_address = ("0.0.0.0", 4000)
    httpd = server_class(server_address, handler_class)
    print("launching server...")
    print("launch http://127.0.0.1:4000")
    httpd.serve_forever()

if __name__ == "__main__":
    run()
