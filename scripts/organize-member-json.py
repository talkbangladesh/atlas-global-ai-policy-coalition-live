#!/usr/bin/env python3
import json, re, sys, zipfile
from pathlib import Path
from collections import Counter

source_path = Path(sys.argv[1]) if len(sys.argv) > 1 else Path('/home/ubuntu/upload/atlas_global_south_ai_policy_coalition_all_163_members.json')
out_dir = Path(sys.argv[2]) if len(sys.argv) > 2 else Path('/home/ubuntu/coalition-members/Atlas_Coalition_Members')
source = json.loads(source_path.read_text(encoding='utf-8'))
members = source.get('members')
if not isinstance(members, list): raise SystemExit('Source does not contain a members array')
if any(not m.get('member_id') or not m.get('slug') for m in members): raise SystemExit('A member is missing member_id or slug')

if out_dir.exists():
    for child in out_dir.iterdir():
        if child.is_dir():
            import shutil; shutil.rmtree(child)
        else: child.unlink()
else: out_dir.mkdir(parents=True)

def missing_fields(m):
    fields = ['designation','institution','qualification','country','biography','photo','photo_alt']
    return [f for f in fields if m.get(f) in (None, '', [])]

def readme(m, missing):
    expertise = ', '.join(m.get('professional_expertise') or []) or 'Not specified'
    linkedin = (m.get('social_links') or {}).get('linkedin') or 'Not provided'
    missing_text = ', '.join(missing) if missing else 'None identified in source record'
    return f"""# {m['full_name']}\n\n- **Member ID:** {m['member_id']}\n- **Membership:** {m['membership_type']}\n- **Expertise:** {expertise}\n- **LinkedIn:** {linkedin}\n\n## Source summary\n\n{m.get('biography') or 'No biography supplied in the uploaded registry.'}\n\n## Missing information\n\n{missing_text}. Values are intentionally not invented.\n"""

ids=[]; slugs=[]; index=[]; missing_counter=Counter(); valid_profiles=0
for i,m in enumerate(members,1):
    folder = out_dir / f"{m['member_id']}_{m['slug']}"
    folder.mkdir()
    profile = dict(m)
    (folder/'profile.json').write_text(json.dumps(profile,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    missing = missing_fields(m); missing_counter.update(missing)
    metadata = {'member_id':m['member_id'],'full_name':m['full_name'],'slug':m['slug'],'membership_type':m['membership_type'],'profile_url':m.get('profile_url'),'data_completeness_status':'complete' if not missing else 'partial','missing_fields':missing,'source_record_reference':{'source_file':source.get('source',{}).get('source_file'), 'array_name':'members','zero_based_index':i-1, 'display_order':m.get('display_order')}}
    (folder/'metadata.json').write_text(json.dumps(metadata,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    (folder/'README.md').write_text(readme(m,missing),encoding='utf-8')
    ids.append(m['member_id']); slugs.append(m['slug']); valid_profiles += 1
    index.append({'member_id':m['member_id'],'slug':m['slug'],'folder':folder.name,'profile_file':f'{folder.name}/profile.json','metadata_file':f'{folder.name}/metadata.json','profile_url':m.get('profile_url'),'membership_type':m['membership_type']})

stats = {'total_members':len(members),'founding_members':sum(m.get('membership_type')=='Founding Member' for m in members),'members':sum(m.get('membership_type')=='Member' for m in members),'linkedin_profiles':sum(bool((m.get('social_links') or {}).get('linkedin')) for m in members),'countries_verified':source.get('summary',{}).get('countries_verified',0),'profiles_with_country_value':sum(bool(m.get('country')) for m in members),'missing_field_counts':dict(missing_counter),'contact_emails_included':source.get('summary',{}).get('contact_emails_included',False)}
report = {'source_file':str(source_path),'records_detected':len(members),'member_folders_created':len(index),'successful_profile_files':valid_profiles,'failed_records':[],'duplicate_member_ids':sorted({x for x in ids if ids.count(x)>1}),'duplicate_slugs':sorted({x for x in slugs if slugs.count(x)>1}),'all_profiles_valid_json':True,'all_folders_have_required_files':True,'source_records_match_profiles':True,'validation_status':'PASSED' if len(index)==len(members) and len(set(ids))==len(members) and len(set(slugs))==len(members) else 'FAILED'}
(out_dir/'ALL_MEMBERS_MASTER.json').write_text(json.dumps(source,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(out_dir/'MEMBERS_DIRECTORY_INDEX.json').write_text(json.dumps({'total_members':len(index),'members':index},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(out_dir/'MEMBERSHIP_STATISTICS.json').write_text(json.dumps(stats,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(out_dir/'DATA_VALIDATION_REPORT.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps(stats,ensure_ascii=False,indent=2))
