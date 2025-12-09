#!/usr/bin/env python3
"""
Simple HTTP server voor Brikx Dashboard
Start met: python dashboard_server.py
"""
import http.server
import socketserver
import json
import subprocess
import os
import sys
from pathlib import Path
from urllib.parse import urlparse, parse_qs

PORT = 8765
BASE_DIR = Path(__file__).parent

class BrikxDashboardHandler(http.server.SimpleHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        parsed_path = urlparse(self.path)

        # API endpoint voor state data
        if parsed_path.path == '/api/state':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()

            try:
                state_file = BASE_DIR / 'state' / 'processed.json'
                with open(state_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                self.wfile.write(json.dumps(data).encode())
            except Exception as e:
                self.wfile.write(json.dumps({'error': str(e)}).encode())
            return

        # API endpoint om sync te starten
        elif parsed_path.path == '/api/run-sync':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()

            try:
                # Start de sync in de achtergrond
                batch_file = BASE_DIR / 'run_funda_sync.bat'

                if sys.platform == 'win32':
                    # Windows: start in nieuw venster
                    subprocess.Popen(['cmd', '/c', 'start', 'cmd', '/k', str(batch_file)],
                                   cwd=str(BASE_DIR))
                else:
                    # Linux/Mac
                    subprocess.Popen(['bash', str(batch_file)], cwd=str(BASE_DIR))

                self.wfile.write(json.dumps({
                    'success': True,
                    'message': 'Sync gestart in nieuw venster'
                }).encode())
            except Exception as e:
                self.wfile.write(json.dumps({
                    'success': False,
                    'error': str(e)
                }).encode())
            return

        # Standaard file serving
        else:
            # Als root wordt gevraagd, serveer dashboard.html
            if parsed_path.path == '/' or parsed_path.path == '':
                self.path = '/dashboard.html'

            return http.server.SimpleHTTPRequestHandler.do_GET(self)

    def do_POST(self):
        parsed_path = urlparse(self.path)
        
        # Handle publish request: /publish/<id>
        if parsed_path.path.startswith('/publish/'):
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            try:
                # Extract ID from path
                listing_id = parsed_path.path.split('/')[-1]
                
                if not listing_id:
                    raise ValueError("No listing ID provided")
                
                # Run publish_worker.py
                script_path = BASE_DIR / 'publish_worker.py'
                
                # Run script and capture output
                result = subprocess.run(
                    [sys.executable, str(script_path), listing_id],
                    cwd=str(BASE_DIR),
                    capture_output=True,
                    text=True
                )
                
                if result.returncode == 0:
                    self.wfile.write(json.dumps({
                        'success': True,
                        'message': f'Listing {listing_id} succesvol gepubliceerd!',
                        'output': result.stdout
                    }).encode())
                else:
                    self.wfile.write(json.dumps({
                        'success': False,
                        'error': f'Publish script failed: {result.stderr}'
                    }).encode())
                    
            except Exception as e:
                self.wfile.write(json.dumps({
                    'success': False,
                    'error': str(e)
                }).encode())
            return
            
        # Handle other POST requests if needed
        self.send_response(404)
        self.end_headers()

    def log_message(self, format, *args):
        """Custom logging"""
        print(f"[{self.log_date_time_string()}] {format % args}")

def main():
    os.chdir(BASE_DIR)

    with socketserver.TCPServer(("", PORT), BrikxDashboardHandler) as httpd:
        print("=" * 60)
        print("Brikx Dashboard Server")
        print("=" * 60)
        print(f"\nServer draait op: http://localhost:{PORT}")
        print(f"Base directory: {BASE_DIR}")
        print(f"\nOpen in je browser: http://localhost:{PORT}")
        print("\nDruk CTRL+C om te stoppen\n")
        print("=" * 60)

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n👋 Server gestopt")
            sys.exit(0)

if __name__ == "__main__":
    main()
