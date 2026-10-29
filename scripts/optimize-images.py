"""Regenerates web-ready certificate thumbnails/full images and the profile photo.
Usage: python3 scripts/optimize-images.py <folder-with-original-jpgs>
Originals are NOT shipped in the site; only optimized WebP files are.
"""
import sys, os
from PIL import Image
src = sys.argv[1] if len(sys.argv) > 1 else 'originals'
MAP = {
 'AWS Cloud Solutions Architect.jpg':'aws-solutions-architect',
 'sql_intermediate_certificate.jpg':'hr-sql-intermediate',
 'python_basic_certificate.jpg':'hr-python',
 'problem_solving_basic_certificate.jpg':'hr-problem-solving',
 'Google_Cyber.jpg':'google-cybersecurity',
 'EC.jpg':'ec-council',
 'DevOps.jpg':'ibm-devops',
 'Foundation_of_Cloud_IoT_Edge_ML.jpg':'nptel-cloud-iot',
 'DB_SQL.jpg':'ibm-db-sql',
 'DB.jpg':'meta-db',
}
Image.MAX_IMAGE_PIXELS = None
os.makedirs('public/certificates', exist_ok=True)
for f, slug in MAP.items():
    im = Image.open(os.path.join(src, f)).convert('RGB')
    for suffix, w, q in (('thumb', 640, 76), ('full', 1600, 80)):
        c = im.copy(); c.thumbnail((w, w * 2), Image.LANCZOS)
        c.save(f'public/certificates/{slug}-{suffix}.webp', 'WEBP', quality=q, method=6)
    print(slug, im.size)
p = Image.open(os.path.join(src, 'profile-placeholder.jpg')).convert('RGB')
p.thumbnail((640, 640), Image.LANCZOS)
p.save('public/profile.webp', 'WEBP', quality=82, method=6)
