import os
from flask_testing import TestCase
from server import app, db, create_test_app, User, Planning_group
import unittest


id_token = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImYyNGQ2YTE5MzA2NjljYjc1ZjE5NzBkOGI3NTRhYTE5M2YwZDkzMWYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiNDg2MTUxMDM3NzkxLXE1YXZnamY2cGM3M2QzOXYxdWFhbHRhOWgzaTBoYTJkLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiNDg2MTUxMDM3NzkxLXE1YXZnamY2cGM3M2QzOXYxdWFhbHRhOWgzaTBoYTJkLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTE3ODMyMDczMTM1OTMyNjcwMTI4IiwiZW1haWwiOiJhbnRvbnN0YWdnZTk1QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiM2tZZnR0WEJ6alJWaUpLdDRlVjV6USIsIm5hbWUiOiJBbnRvbiBTdGFnZ2UiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tLy03VFpGNmRXVkZoZy9BQUFBQUFBQUFBSS9BQUFBQUFBQUFBQS9BQ0hpM3JkRkFnd3FxeFV6TGhVLUQyQWhlNzdUVUc5NTRRL3M5Ni1jL3Bob3RvLmpwZyIsImdpdmVuX25hbWUiOiJBbnRvbiIsImZhbWlseV9uYW1lIjoiU3RhZ2dlIiwibG9jYWxlIjoic3YiLCJpYXQiOjE1NTE0NjE5MTYsImV4cCI6MTU1MTQ2NTUxNiwianRpIjoiYjYyMjVjMjM5OTc4N2I5YTJhNGE4ZDUzZTRiNTE3ZGFiMmE0NmE0ZiJ9.B9jUgY4xsHIFmxY3FMFelcWYkvNNUCySYG4TfO8V-C_XbgIblGv9IDdnQiPgJJTN0zWpDF9IXU2iewIV6ra0p1tZXM-rbEzpxtg_F603Bk2k-zHK92ipnLushup-TneY_t1v4IyuV-Tqo62ROgCoXmuAcknRqyRxZpviCeOzP7ORS8Qj7WmnFnyqK-VsfTVeXYNS0CLdUwy6-hcZhj_R8afQPuQObZTtZMUJCNugRi1Q9EF0p4iXgdlQfuTtBNvqeeZfkDoAuzC4gG4fhFuT6_l_kSPoKO8wECsvzcEFyN_J4yr4AhqC_5oloxhrvI86xZF5GBi6QRe1QEzDa8stew"

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
            from_date="2019-02-20",
            to_date="2019-02-21",
            from_time="10:00",
            to_time="18:00",
            meeting_length="01:00",
            user_name="test_user",
            access_token="accessToken",
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
            from_date="2019-02-20",
            to_date="2019-02-21",
            from_time="10:00",
            to_time="18:00",
            meeting_length="01:00",
            user_name="test_user",
            access_token="accessToken",
            id_token=id_token
        ))
        self.assert_400(resp)
        assert 'error' in resp.json
        assert 'Missing' in resp.json['error']

    def test_creategroup_invalid_date(self):
        resp = self.client.post('/api/creategroup', json=dict(
            group_name="test_group",
            from_date="20d19-02-20",
            to_date="2019-02-21",
            from_time="10:00",
            to_time="18:00",
            meeting_length="01:00",
            user_name="test_user",
            access_token="accessToken",
            id_token=id_token
        ))
        self.assert_400(resp)
        assert 'error' in resp.json
        assert 'does not match' in resp.json['error']

    def test_creategroup_long_name(self):
        resp = self.client.post('/api/creategroup', json=dict(
            group_name="test_group",
            from_date="2019-02-20",
            to_date="2019-02-21",
            from_time="10:00",
            to_time="18:00",
            meeting_length="01:00",
            user_name="this is a vey long name what the hell is going on",
            access_token="accessToken",
            id_token=id_token
        ))
        self.assert_400(resp)
        assert 'error' in resp.json
        assert 'too long' in resp.json['error']
    
    def test_creategroup_invalid_id_token(self):
        resp = self.client.post('/api/creategroup', json=dict(
            group_name="test_group",
            from_date="2019-02-20",
            to_date="2019-02-21",
            from_time="10:00",
            to_time="18:00",
            meeting_length="01:00",
            user_name="test_user",
            access_token="accessToken",
            id_token="invalid"
        ))
        self.assert_400(resp)
        assert 'error' in resp.json
        assert 'Could not authenticate' in resp.json['error']

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

    """ TEST GETUSERFROMGROUP """ 
    def test_getusersfromgroup_good(self):
        grp_resp = self.test_creategroup_good()
        resp = self.client.get('/api/getusersfromgroup',headers=dict(
            group_str_id=grp_resp['group_str_id'],
            google_id=grp_resp['google_id'],
        ))
        self.assert200(resp)
        assert 'owner' in resp.json
        assert len(resp.json['users']) == 1

    def test_getusersfromgroup_missing_grp(self):
        grp_resp = self.test_creategroup_good()
        resp = self.client.get('/api/getusersfromgroup',headers=dict(
            google_id=grp_resp['google_id'],
        ))
        self.assert403(resp)
        assert 'error' in resp.json
        assert 'group_str_id' in resp.json['error']
    
    def test_getusersfromgroup_access(self):
        grp_resp = self.test_creategroup_good()
        resp = self.client.get('/api/getusersfromgroup',headers=dict(
            group_str_id=grp_resp['group_str_id'],
        ))
        self.assert403(resp)
        assert 'error' in resp.json
        assert 'Access' in resp.json['error']
    
    def test_getusersfromgroup_no_header(self):
        grp_resp = self.test_creategroup_good()
        resp = self.client.get('/api/getusersfromgroup')
        self.assert403(resp)
        assert 'error' in resp.json
        assert 'Access' in resp.json['error']

    """ TEST GETGROUPCALENDAR """ 
    def test_getgroupcalendar_good(self):
        grp_resp = self.test_creategroup_good()
        raise NotImplementedError
        resp = self.client.get('/api/getgroupcalendar',headers=dict(
            group_str_id=grp_resp['group_str_id'],
            google_id=grp_resp['google_id'],
        ))
        
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

if __name__ == "__main__":
    unittest.main(warnings='ignore')