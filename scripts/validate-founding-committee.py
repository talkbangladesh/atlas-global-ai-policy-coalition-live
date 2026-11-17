import json
from pathlib import Path

committee = json.loads(Path('data/founding-committee.json').read_text(encoding='utf-8'))
members = json.loads(Path('data/members.json').read_text(encoding='utf-8'))['members']
expected = [
    ('Gábor Soós, PhD', 'Co-Chair'),
    ('Wafa Al-Daily', 'Co-Chair'),
    ('Douglas Mbang Massom', 'Research Collaboration & Partnerships'),
    ('Ekaterina Matveeva', 'Youth, Multilingualism & Cultural AI Governance'),
    ('Pretty Tega Edema', 'AI Governance, Law & Rights'),
    ('Rooba Moorghen', 'Public Policy & Institutional Implementation'),
    ('Dr. Jelina Haines', 'Indigenous Knowledge & Community Governance'),
    ('Nafiul Ahmad Rafi', 'Founding Convenor & Executive Director'),
]
actual = [(item['full_name'], item['designation']) for item in committee['members']]
assert committee['total_members'] == 8
assert actual == expected, (actual, expected)
assert len({item['member_id'] for item in committee['members']}) == 8
by_id = {member['member_id']: member for member in members}
for item in committee['members']:
    assert item['member_id'] in by_id
    assert item['profile_slug'] == by_id[item['member_id']]['slug']
print('FOUNDING COMMITTEE VALIDATION PASSED: exact 8-member source roster, names/designations, unique IDs, and profile links confirmed.')
