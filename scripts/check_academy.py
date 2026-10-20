#!/usr/bin/env python3
"""Static Academy integrity checks: no network, no third-party dependencies."""
from pathlib import Path
from html.parser import HTMLParser
import re, sys
ROOT=Path(__file__).resolve().parents[1]
IGNORE=('http:','https:','mailto:','tel:','javascript:','data:','#','//')
class Page(HTMLParser):
 def __init__(self):
  super().__init__();self.links=[];self.frames=[];self.ids=set();self.duplicates=[];self.images_without_alt=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if a.get('id'):
   if a['id'] in self.ids:self.duplicates.append(a['id'])
   self.ids.add(a['id'])
  if tag=='img' and 'alt' not in a:self.images_without_alt.append(a.get('src','(inline)'))
  if tag in ('a','link','script','img'):
   key={'a':'href','link':'href','script':'src','img':'src'}[tag]
   if a.get(key):self.links.append(a[key])
  if tag=='iframe' and a.get('src'):self.frames.append(a['src'])
errors=[];pages=list(ROOT.glob('*.html'))
for file in pages:
 p=Page()
 try:p.feed(file.read_text(encoding='utf-8'))
 except Exception as exc:errors.append(f'{file.name}: HTML parser: {exc}');continue
 for duplicate in p.duplicates:errors.append(f'{file.name}: duplicate element id {duplicate}')
 for src in p.images_without_alt:errors.append(f'{file.name}: image lacks alt attribute: {src}')
 source=file.read_text(encoding='utf-8')
 if not re.search(r'<html[^>]*\blang=',source,re.I):errors.append(f'{file.name}: missing HTML language')
 if not re.search(r'<meta[^>]*name=[\"\\\']viewport[\"\\\']',source,re.I):errors.append(f'{file.name}: missing mobile viewport')
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
# Global navigation links are created in JavaScript, so they need their own link audit.
nav=(ROOT/'assets/academy-navigation.js').read_text(encoding='utf-8')
for href in re.findall(r"\['([^']+\.html(?:\?[^']*)?)','[^']+'\]",nav):
 path=href.split('?')[0]
 if not (ROOT/path).is_file():errors.append('Global navigation: missing '+href)
required=['index.html','week-one-academy.html','week-two-academy.html','weekly-studio.html','studio-record.html','term-one-progressive-curriculum.html','musicality-pathway.html','assets/academy-editorial.css','assets/academy-navigation.js']
for path in required:
 if not (ROOT/path).is_file():errors.append('Missing essential page or asset: '+path)
if errors:
 print('ACADEMY STATIC QA FAILED ('+str(len(errors))+')')
 for e in errors:print(' - '+e)
 sys.exit(1)
print(f'ACADEMY STATIC QA PASSED: {len(pages)} HTML pages, required assets, internal links, Drive embed patterns')
