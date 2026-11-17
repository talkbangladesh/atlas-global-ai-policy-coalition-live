import json,sys
from pathlib import Path
d=json.loads(Path('data/members.json').read_text()); ms=d['members']; errors=[]
for key in ('member_id','slug','full_name','membership_type'):
    missing=[m.get('member_id') for m in ms if not m.get(key)]
    if missing: errors.append(f'{key} missing: {missing}')
for key in ('member_id','slug'):
    vals=[m[key] for m in ms if m.get(key)]; dup=sorted({x for x in vals if vals.count(x)>1})
    if dup: errors.append(f'{key} duplicate: {dup}')
if errors:
    print('VALIDATION FAILED'); print('\n'.join(errors)); sys.exit(1)
print(f'VALIDATION PASSED: {len(ms)} records; unique IDs and slugs confirmed.')
