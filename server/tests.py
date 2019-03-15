import os
from flask_testing import TestCase
from server import app, db, create_test_app, User, Planning_group
import unittest
from datetime import datetime
from datetime import timedelta

id_token = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjVmZTJkNTQxYTQyODJiN2FlMzYyOGZhMDc0ZGQ4YmVhNmRhNWIxOWIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiNDg2MTUxMDM3NzkxLXE1YXZnamY2cGM3M2QzOXYxdWFhbHRhOWgzaTBoYTJkLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiNDg2MTUxMDM3NzkxLXE1YXZnamY2cGM3M2QzOXYxdWFhbHRhOWgzaTBoYTJkLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTE3ODMyMDczMTM1OTMyNjcwMTI4IiwiZW1haWwiOiJhbnRvbnN0YWdnZTk1QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiVnJmLUJEdmNaUnp3VmRtNlRfanNlUSIsIm5hbWUiOiJBbnRvbiBTdGFnZ2UiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tLy03VFpGNmRXVkZoZy9BQUFBQUFBQUFBSS9BQUFBQUFBQUFBQS9BQ0hpM3JkRkFnd3FxeFV6TGhVLUQyQWhlNzdUVUc5NTRRL3M5Ni1jL3Bob3RvLmpwZyIsImdpdmVuX25hbWUiOiJBbnRvbiIsImZhbWlseV9uYW1lIjoiU3RhZ2dlIiwibG9jYWxlIjoic3YiLCJpYXQiOjE1NTI1NTkzMTksImV4cCI6MTU1MjU2MjkxOSwianRpIjoiMTQwN2FiZjZhMTMzYjcwYjViMmM5ODUwZWVkNjJjNDNmNjg2NWRkMSJ9.ORsadW67Uz_CBP1DCjqyE0y8eDRxFN-B7R17y52VV7kV5KOpPcf0yOTXFvJDlqO75mXDQGrSViI-A5VB3jBnwbixnyBLvuZbzLavR7XURik-gTBffsUHJaSrcMpZaadRbxxO5J47S5GrSukv3SvqyB37pycCQLyWgbny15jy84c98PtsR7Rg_mAvlXEUqpPyqfozrU0_VJPW7wtglHKOFoEHbAh6rrjGmj8V8i38NG_RwSObgAA2MshCjSqdEC_rWcGQz0wr3uqz2vkhW0nu-9TuoYLQSgzE-Uf8SSMfFVnbe5z-eAF4398XYjnLL8ULvXXsA0BYp15H9BRfMF_U8Q"
access_token = "ya29.GmXMBlouLRX-uQEabXa_hEjDRbJeMYa6hATcub166f8gnt4cDRgCGQt70VMvRFMfjLRmgfKlLttAdhogPK6Eh7mB8QPT2i4bmrbdcpq5vIOeWMg72rcRBHuOJyrG6iNWx10PVBoLuw"
from_date = str(datetime.now().date())
to_date = str((datetime.now() + timedelta(days=1)).date())
from_time = str(datetime.now().time())[:5]
to_time = str((datetime.now() + timedelta(hours=2)).time())[:5]
meeting_length = "01:00"

class MyTest(TestCase):
    
    def create_app(self):
        return create_test_app(app)
    
    def setUp(self):
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()

    def test_index(self):
        resp = self.client.get('/')
        assert b'html' in resp.data
        self.assert200(resp)
    

    """ TEST CREATE GROUP """
    def test_creategroup_good(self):
        resp = self.client.post('/api/creategroup', json=dict(
            group_name="test_group",
            from_date=from_date,
            to_date=to_date,
            from_time=from_time,
            to_time=to_time,
            meeting_length=meeting_length,
            user_name="test_user",
            access_token=access_token,
            id_token=id_token
        ))
        if resp.status_code != 201:
            print(resp.json)
        assert resp.status_code == 201
        assert 'group_str_id' in resp.json
        assert 'google_id' in resp.json
        group = Planning_group.query.filter_by(group_str_id=resp.json['group_str_id']).first()
        assert group is not None
        assert group.name == 'test_group'
        user = User.query.filter_by(name='test_user').first()
        assert user is not None
        return resp.json
    
    def test_creategroup_missing(self):
        resp = self.client.post('/api/creategroup', json=dict(
            from_date=from_date,
            to_date=to_date,
            from_time=from_time,
            to_time=to_time,
            meeting_length=meeting_length,
            user_name="test_user",
            access_token=access_token,
            id_token=id_token
        ))
        self.assert_400(resp)
        assert 'error' in resp.json
        assert 'Missing' in resp.json['error']

    def test_creategroup_invalid_date(self):
        resp = self.client.post('/api/creategroup', json=dict(
            group_name="test_group",
            from_date=from_date,
            to_date=to_date,
            from_time="002:32",
            to_time=to_time,
            meeting_length=meeting_length,
            user_name="test_user",
            access_token=access_token,
            id_token=id_token
        ))
        self.assert_400(resp)
        assert 'error' in resp.json
        assert 'does not match' in resp.json['error']

    def test_creategroup_long_name(self):
        resp = self.client.post('/api/creategroup', json=dict(
            group_name="test_group",
            from_date=from_date,
            to_date=to_date,
            from_time=from_time,
            to_time=to_time,
            meeting_length=meeting_length,
            user_name="this is a vey long name what the hell is going on",
            access_token=access_token,
            id_token=id_token
        ))
        self.assert_400(resp)
        assert 'error' in resp.json
        assert 'too long' in resp.json['error']
    
    def test_creategroup_invalid_id_token(self):
        resp = self.client.post('/api/creategroup', json=dict(
            group_name="test_group",
            from_date=from_date,
            to_date=to_date,
            from_time=from_time,
            to_time=to_time,
            meeting_length=meeting_length,
            user_name="test_user",
            access_token=access_token,
            id_token="invalid"
        ))
        self.assert_400(resp)
        assert 'error' in resp.json
        assert 'Could not authenticate' in resp.json['error']
    
    def test_creategroup_in_past(self):
        resp = self.client.post('/api/creategroup', json=dict(
            group_name="test_group",
            from_date="2018-01-01",
            to_date=to_date,
            from_time=from_time,
            to_time=to_time,
            meeting_length=meeting_length,
            user_name="test_user",
            access_token=access_token,
            id_token=id_token
        ))
        self.assert400(resp)
        assert 'error' in resp.json
        assert 'past' in resp.json['error']
    
    def test_creategroup_backwards_1(self):
        resp = self.client.post('/api/creategroup', json=dict(
            group_name="test_group",
            from_date=from_date,
            to_date=str((datetime.now() - timedelta(days=1)).date()),
            from_time=from_time,
            to_time=to_time,
            meeting_length=meeting_length,
            user_name="test_user",
            access_token=access_token,
            id_token=id_token
        ))
        self.assert400(resp)
        assert 'error' in resp.json
        assert 'backwards' in resp.json['error']

    def test_creategroup_backwards_2(self):
        resp = self.client.post('/api/creategroup', json=dict(
            group_name="test_group",
            from_date=from_date,
            to_date=to_date,
            from_time="12:00",
            to_time="11:59",
            meeting_length=meeting_length,
            user_name="test_user",
            access_token=access_token,
            id_token=id_token
        ))
        self.assert400(resp)
        assert 'error' in resp.json
        assert 'backwards' in resp.json['error']
    
    def test_creategroup_more_than_year(self):
        resp = self.client.post('/api/creategroup', json=dict(
            group_name="test_group",
            from_date=from_date,
            to_date=str((datetime.now() + timedelta(days=361)).date()),
            from_time=from_time,
            to_time=to_time,
            meeting_length=meeting_length,
            user_name="test_user",
            access_token=access_token,
            id_token=id_token
        ))
        self.assert400(resp)
        assert 'error' in resp.json
        assert 'year' in resp.json['error']

    """ TEST ADDUSER """ 
    def test_adduser_good(self):
        grp_resp = self.test_creategroup_good()
        resp = self.client.post('/api/adduser',headers=dict(
            group_str_id=grp_resp['group_str_id'],
        ), json=dict(
            name="test_user",
            access_token="access_token_new",
            id_token=id_token
        ))
        self.assert200(resp)
        assert 'google_id' in resp.json
        assert resp.json['google_id'] == grp_resp['google_id']
        user = User.query.filter_by(name='test_user').first()
        assert user is not None
        assert user.access_token == 'access_token_new'
    
    def test_adduser_missing_grp(self):
        grp_resp = self.test_creategroup_good()
        resp = self.client.post('/api/adduser', json=dict(
            name="test_user",
            access_token="access_token",
            id_token=id_token
        ))
        self.assert403(resp)
        assert 'error' in resp.json
        assert 'group_str_id' in resp.json['error']

    def test_adduser_too_long(self):
        grp_resp = self.test_creategroup_good()
        resp = self.client.post('/api/adduser',headers=dict(
            group_str_id=grp_resp['group_str_id'],
        ), json=dict(
            name="test_user with a name that is waaaay too long",
            access_token="access_token",
            id_token=id_token
        ))
        self.assert400(resp)
        assert 'error' in resp.json
        assert 'too long' in resp.json['error']

    """ TEST GETGROUPCALENDAR """ 
    def test_getgroupcalendar_good(self):
        grp_resp = self.test_creategroup_good()
        resp = self.client.get('/api/getgroupcalendar',headers=dict(
            group_str_id=grp_resp['group_str_id'],
            google_id=grp_resp['google_id'],
        ))
        self.assert200(resp)
        assert 'owner' in resp.json
        assert len(resp.json['users']) == 1
        assert 'events' in resp.json
        assert 'you' in resp.json
        assert 'group' in resp.json
        assert resp.json['group']['name'] == "test_group"
        assert resp.json['group']['from_date'] == from_date
        assert resp.json['group']['from_time'] == from_time
        assert resp.json['group']['to_date'] == to_date
        assert resp.json['group']['to_time'] == to_time
        assert resp.json['group']['meeting_length'] == meeting_length

    def test_getgroupcalendar_missing_grp(self):
        grp_resp = self.test_creategroup_good()
        resp = self.client.get('/api/getgroupcalendar',headers=dict(
            google_id=grp_resp['google_id'],
        ))
        self.assert403(resp)
        assert 'error' in resp.json
        assert 'group_str_id' in resp.json['error']
    
    def test_getgroupcalendar_access(self):
        grp_resp = self.test_creategroup_good()
        resp = self.client.get('/api/getgroupcalendar',headers=dict(
            group_str_id=grp_resp['group_str_id'],
        ))
        self.assert403(resp)
        assert 'error' in resp.json
        assert 'Access' in resp.json['error']

    def test_getgroupcalendar_no_header(self):
        grp_resp = self.test_creategroup_good()
        resp = self.client.get('/api/getgroupcalendar')
        self.assert403(resp)
        assert 'error' in resp.json
        assert 'Access' in resp.json['error']

    def test_getgroupcalendar_access_token_bad(self):
        grp_resp = self.client.post('/api/creategroup', json=dict(
            group_name="test_group",
            from_date=from_date,
            to_date=to_date,
            from_time=from_time,
            to_time=to_time,
            meeting_length=meeting_length,
            user_name="test_user",
            access_token="access_token_bad",
            id_token=id_token
        )).json
        resp = self.client.get('/api/getgroupcalendar',headers=dict(
            group_str_id=grp_resp['group_str_id'],
            google_id=grp_resp['google_id'],
        ))
        self.assert400(resp)
        assert 'error' in resp.json
        assert 'expired' in resp.json['error']

    """ TEST REMOVE """ 
    def test_remove_good(self):
        grp_resp = self.test_creategroup_good()
        resp = self.client.delete('/api/remove',headers=dict(
            group_str_id=grp_resp['group_str_id'],
            google_id=grp_resp['google_id'],
        ))
        assert resp.status_code == 202
        group = Planning_group.query.filter_by(group_str_id=grp_resp['group_str_id']).first()
        assert group is None
        user = User.query.filter_by(name='test_user').first()
        assert user is None
    
    def test_remove_missing_grp(self):
        grp_resp = self.test_creategroup_good()
        resp = self.client.delete('/api/remove',headers=dict(
            google_id=grp_resp['google_id'],
        ))
        self.assert403(resp)
        assert 'error' in resp.json
        assert 'group_str_id' in resp.json['error']

    def test_remove_access(self):
        grp_resp = self.test_creategroup_good()
        resp = self.client.delete('/api/remove',headers=dict(
            group_str_id=grp_resp['group_str_id'],
        ))
        self.assert403(resp)
        assert 'error' in resp.json
        assert 'Access' in resp.json['error']

    def test_remove_no_header(self):
        grp_resp = self.test_creategroup_good()
        resp = self.client.delete('/api/remove')
        self.assert403(resp)
        assert 'error' in resp.json
        assert 'Access' in resp.json['error']

    """ UPDATEACCESSTOKEN TEST """
    def test_update_access_token_good(self):
        grp_resp = self.test_creategroup_good()
        resp = self.client.put('/api/updateaccesstoken', headers=dict(
            google_id=grp_resp['google_id']
        ), json=dict(
            access_token="new_access_token"
        ))
        self.assert200(resp)
        user = User.query.filter_by(google_id=grp_resp['google_id']).first()
        assert user is not None
        assert user.access_token == "new_access_token"
    
    def test_update_access_token_access(self):
        grp_resp = self.test_creategroup_good()
        resp = self.client.put('/api/updateaccesstoken',json=dict(
            access_token="new_access_token"
        ))
        self.assert403(resp)
        assert 'error' in resp.json
        assert 'Access' in resp.json['error']
    
    def test_update_access_token_missing(self):
        grp_resp = self.test_creategroup_good()
        resp = self.client.put('/api/updateaccesstoken', headers=dict(
            google_id=grp_resp['google_id']
        ))
        self.assert400(resp)
        assert 'error' in resp.json
        assert 'Missing' in resp.json['error']

    def test_update_access_token_wrong(self):
        grp_resp = self.test_creategroup_good()
        resp = self.client.put('/api/updateaccesstoken', headers=dict(
            google_id=grp_resp['google_id']
        ), json=dict(
            accccccess_token="new_access_token"
        ))
        self.assert400(resp)
        assert 'error' in resp.json
        assert 'Missing' in resp.json['error']

if __name__ == "__main__":
    unittest.main(warnings='ignore')