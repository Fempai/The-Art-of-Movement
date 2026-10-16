#!/usr/bin/env python3
"""Static Academy integrity checks: no network, no third-party dependencies."""
from pathlib import Path
from html.parser import HTMLParser
import re, sys
ROOT=Path(__file__).resolve().parents[1]
IGNORE=('http:','https:','mailto:','tel:','javascript:','data:','#','//')
class Page(HTMLParser):
 def __init__(self):
  super().__init__();self.links=[];self.frames=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag in ('a','link','script','img'):
   key={'a':'href','link':'href','script':'src','img':'src'}[tag]
   if a.get(key):self.links.append(a[key])
  if tag=='iframe' and a.get('src'):self.frames.append(a['src'])
errors=[];pages=list(ROOT.glob('*.html'))
for file in pages:
 p=Page()
 try:p.feed(file.read_text(encoding='utf-8'))
 except Exception as exc:errors.append(f'{file.name}: HTML parser: {exc}');continue
 for link in p.links:
  if link.startswith(IGNORE):continue
  path=link.split('#')[0].split('?')[0]
  if not path:continue
  target=(file.parent/path).resolve()
  if not target.is_relative_to(ROOT.resolve()):errors.append(f'{file.name}: path escapes repo: {link}');continue
  if target.is_dir():target=target/'index.html'
  if not target.exists():errors.append(f'{file.name}: missing local link {link}')
 for src in p.frames:
  if 'drive.google.com/file/d/' in src and not re.search(r'/file/d/[A-Za-z0-9_-]{15,}/(?:preview|view)',src):errors.append(f'{file.name}: malformed Drive embed')
required=['index.html','week-one-academy.html','week-two-academy.html','weekly-studio.html','studio-record.html','term-one-progressive-curriculum.html','musicality-pathway.html','assets/academy-editorial.css','assets/academy-navigation.js']
for path in required:
 if not (ROOT/path).is_file():errors.append('Missing essential page or asset: '+path)
if errors:
 print('ACADEMY STATIC QA FAILED ('+str(len(errors))+')')
 for e in errors:print(' - '+e)
 sys.exit(1)
print(f'ACADEMY STATIC QA PASSED: {len(pages)} HTML pages, required assets, internal links, Drive embed patterns')
