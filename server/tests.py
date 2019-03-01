import os
from flask_testing import TestCase
from server import app, db, create_test_app
import unittest


id_token = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImYyNGQ2YTE5MzA2NjljYjc1ZjE5NzBkOGI3NTRhYTE5M2YwZDkzMWYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiNDg2MTUxMDM3NzkxLXE1YXZnamY2cGM3M2QzOXYxdWFhbHRhOWgzaTBoYTJkLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiNDg2MTUxMDM3NzkxLXE1YXZnamY2cGM3M2QzOXYxdWFhbHRhOWgzaTBoYTJkLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTE3ODMyMDczMTM1OTMyNjcwMTI4IiwiZW1haWwiOiJhbnRvbnN0YWdnZTk1QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiWUtsQWlBM0k1VHoya1VpaVktZHViQSIsIm5hbWUiOiJBbnRvbiBTdGFnZ2UiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tLy03VFpGNmRXVkZoZy9BQUFBQUFBQUFBSS9BQUFBQUFBQUFBQS9BQ0hpM3JkRkFnd3FxeFV6TGhVLUQyQWhlNzdUVUc5NTRRL3M5Ni1jL3Bob3RvLmpwZyIsImdpdmVuX25hbWUiOiJBbnRvbiIsImZhbWlseV9uYW1lIjoiU3RhZ2dlIiwibG9jYWxlIjoic3YiLCJpYXQiOjE1NTE0NTc2OTYsImV4cCI6MTU1MTQ2MTI5NiwianRpIjoiOTA1NmQzMzYxODA0ZjM4YzI4M2QxYmI5Yjc1YzJiN2E1MDMwMjVjYyJ9.ThrLubKw42dmyMMip4Nt77LapX6AGJNQ7MHVnnlOSyr68pDqAZ6Q49G9xnnruuPTt1yD4qCdRK-eF0WcFU6UNxlOg2VKtc88XQNzK-gyb1oxRqWOeqgRBbUQp4DMJzalSmASRDVyZSxsEmVd93a8RDaJr4n7_7sB0nHnZ3CbXc1l2-rgFn1qnNk4aDrn1rxrz9KVX5TYAIpxJECenZPw450jhFfw7gpPLeqGp08xqz1fmt5iw1Sf7gzwNYv6PVhSm92GpukaYRqFfI4uZMlNh-vgl4SIzz2Z0s7Zaumqs-Cb0fjnCSDHXA57ELxiXSZVvDp2fJ78Rrk1N_KZBWKyjQ"

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
        assert resp.status_code == 200
    
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
        assert resp.status_code == 201
        assert 'group_str_id' in resp.json
        assert 'google_id' in resp.json

if __name__ == "__main__":
    unittest.main()