#!/usr/bin/env python3
"""Static regression checks for The Art of Movement (no external dependencies)."""
from pathlib import Path
from html.parser import HTMLParser
import re
import subprocess
import sys
import tempfile

ROOT=Path(__file__).resolve().parents[1]
PAGES=['index.html','my-academy.html','live-coach.html','pose-lab.html','assessment-history.html','movement-assessment-studio.html','movement-bridge.html','weekly-studio.html']
class Scan(HTMLParser):
    def __init__(self):
        super().__init__();self.ids=set();self.scripts=[];self.inscript=False;self.buffer=[]
    def handle_starttag(self,tag,attrs):
        attrs=dict(attrs)
        if attrs.get('id'):
            if attrs['id'] in self.ids: raise ValueError('duplicate id '+attrs['id'])
            self.ids.add(attrs['id'])
        if tag=='script' and not attrs.get('src'):self.inscript=True;self.buffer=[]
    def handle_data(self,data):
        if self.inscript:self.buffer.append(data)
    def handle_endtag(self,tag):
        if tag=='script' and self.inscript:self.scripts.append(''.join(self.buffer));self.inscript=False

fail=[]
for name in PAGES:
    path=ROOT/name
    if not path.exists():fail.append('Missing '+name);continue
    source=path.read_text(encoding='utf-8')
    parser=Scan()
    try:parser.feed(source)
    except ValueError as e:fail.append(name+': '+str(e))
    for n,script in enumerate(parser.scripts):
        if not script.strip():continue
        with tempfile.NamedTemporaryFile(mode='w',suffix='.mjs',encoding='utf-8') as tmp:
            tmp.write(script);tmp.flush()
            result=subprocess.run(['node','--check',tmp.name],capture_output=True,text=True)
            if result.returncode:fail.append(name+' script '+str(n)+': '+result.stderr.strip())
    for match in re.finditer(r"""(?:getElementById\(['"]|\$\(['"])([\w-]+)['"]\)""",source):
        # A string prefix concatenated with a variable is not a literal DOM id.
        if re.match(r'\s*\+',source[match.end():]):continue
        if match.group(1) not in parser.ids:fail.append(name+': missing DOM id '+match.group(1))
for page in ['live-coach.html','pose-lab.html']:
    src=(ROOT/page).read_text()
    if 'pose_landmarker_full' not in src:fail.append(page+': expected full pose model')
if 'aom_assessment_history_v1' not in (ROOT/'pose-lab.html').read_text():fail.append('Pose Lab assessment-history integration missing')
# Guard against accidental regressions in privacy-sensitive movement workflows.
coach=(ROOT/'live-coach.html').read_text(encoding='utf-8')
pose=(ROOT/'pose-lab.html').read_text(encoding='utf-8')
if "pose_landmarker_lite" not in coach or "pose_landmarker_full" not in coach:
    fail.append('Live Coach: Full-to-Lite fallback missing')
if "lastGoodFrame" not in coach or "visibilitychange" not in coach:
    fail.append('Live Coach: interrupted/background hold protection missing')
if "pose_landmarker_lite" not in pose or "pose_landmarker_full" not in pose:
    fail.append('Pose Lab: Full-to-Lite fallback missing')
if "selectedVideoName" not in pose or "confirm(" not in pose or "Cloudflare AI" not in pose:
    fail.append('Pose Lab: cloud review disclosure/confirmation missing')
if "review_id:id,evidence:{observations:good,skill_evidence:circleEvidence}" not in pose:
    fail.append('Pose Lab: expected landmark-only review payload changed; inspect before release')
if "video.onseeked" not in pose or "lastEvidence=null" not in pose:
    fail.append('Pose Lab: seek/evidence reset missing')
if fail:
    print('FAILED static checks:')
    print('\n'.join(' - '+x for x in sorted(set(fail))))
    sys.exit(1)
print('Static checks passed for '+str(len(PAGES))+' core pages. Browser/device testing is still required.')
