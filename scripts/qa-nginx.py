"""Serves dist/ through the real nginx.conf and checks routing, redirects, 404 and headers.
Needs nginx installed locally. Run after `npm run build`:  python3 scripts/qa-nginx.py
Catches config mistakes (for example redirect loops) that a plain static server hides."""
import pathlib, subprocess, sys, tempfile, time, urllib.request, urllib.error

root = pathlib.Path(__file__).resolve().parent.parent
PORT = 4398
tmp = pathlib.Path(tempfile.mkdtemp())
site = (root / 'nginx.conf').read_text().replace('listen 80;', f'listen {PORT};').replace('root /usr/share/nginx/html;', f'root {root / "dist"};')
site = site.replace('/etc/nginx/snippets/portfolio-headers.conf', str(root / 'portfolio-headers.conf'))
(tmp / 'site.conf').write_text(site)
(tmp / 'nginx.conf').write_text(f"""pid {tmp}/n.pid; error_log {tmp}/err.log; worker_processes 1; daemon off;
events {{ worker_connections 32; }}
http {{ include /etc/nginx/mime.types; access_log off; client_body_temp_path {tmp}/a; proxy_temp_path {tmp}/b; fastcgi_temp_path {tmp}/c; uwsgi_temp_path {tmp}/d; scgi_temp_path {tmp}/e; include {tmp}/site.conf; }}""")

class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *a, **k): return None
opener = urllib.request.build_opener(NoRedirect)
def get(path):
    try:
        r = opener.open(f'http://127.0.0.1:{PORT}{path}', timeout=5); return r.status, dict(r.headers)
    except urllib.error.HTTPError as e: return e.code, dict(e.headers)

proc = subprocess.Popen(['nginx', '-c', str(tmp / 'nginx.conf')], stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
time.sleep(1.2)
fails = []
def expect(path, status, location=None):
    st, h = get(path)
    ok = st == status and (location is None or h.get('Location', '').endswith(location))
    print(('ok  ' if ok else 'FAIL'), path, st, h.get('Location', ''))
    if not ok: fails.append(path)
try:
    for p in ['/', '/about/', '/projects/', '/projects/shipforge/', '/skills/', '/education/', '/contact/', '/sitemap.xml', '/robots.txt', '/favicon.ico', '/resume/Garv_Gupta_Resume.pdf']:
        expect(p, 200)
    for old, new in [('/about.html', '/about/'), ('/projects.html', '/projects/'), ('/skills.html', '/skills/'), ('/education.html', '/education/'), ('/contact.html', '/contact/'), ('/about', '/about/')]:
        expect(old, 301, new)
    expect('/does-not-exist/', 404)
    st, h = get('/')
    for header in ['Content-Security-Policy', 'X-Content-Type-Options', 'X-Frame-Options', 'Referrer-Policy']:
        if header not in h: fails.append('missing header ' + header); print('FAIL missing', header)
finally:
    proc.terminate()
print('FAILED' if fails else 'nginx QA passed')
sys.exit(1 if fails else 0)
