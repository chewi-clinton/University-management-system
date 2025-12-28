import requests
import json
import base64
from datetime import datetime, timedelta
from django.conf import settings
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)


class ZoomAPIClient:
    """Client for Zoom API integration"""
    
    def __init__(self):
        self.api_key = settings.ZOOM_API_KEY
        self.api_secret = settings.ZOOM_API_SECRET
        self.account_id = settings.ZOOM_ACCOUNT_ID
        self.base_url = "https://api.zoom.us/v2"
        self.access_token = None
        self.token_expires_at = None
    
    def _get_access_token(self):
        """Get OAuth access token for Zoom API"""
        if self.access_token and self.token_expires_at > timezone.now():
            return self.access_token
        
        try:
            # Create JWT token for server-to-server OAuth
            token_url = f"https://zoom.us/oauth/token"
            
            headers = {
                'Authorization': f'Basic {base64.b64encode(f"{self.api_key}:{self.api_secret}".encode()).decode()}',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
            
            data = {
                'grant_type': 'account_credentials',
                'account_id': self.account_id
            }
            
            response = requests.post(token_url, headers=headers, data=data)
            response.raise_for_status()
            
            token_data = response.json()
            self.access_token = token_data['access_token']
            self.token_expires_at = timezone.now() + timedelta(seconds=token_data['expires_in'] - 300)
            
            logger.info("Successfully obtained Zoom access token")
            return self.access_token
            
        except Exception as e:
            logger.error(f"Error getting Zoom access token: {e}")
            raise
    
    def _make_request(self, method, endpoint, data=None):
        """Make authenticated request to Zoom API"""
        token = self._get_access_token()
        
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
        
        url = f"{self.base_url}/{endpoint}"
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=data)
            elif method == 'POST':
                response = requests.post(url, headers=headers, json=data)
            elif method == 'PATCH':
                response = requests.patch(url, headers=headers, json=data)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, json=data)
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")
            
            response.raise_for_status()
            return response.json() if response.content else {}
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Zoom API request failed: {e}")
            raise
    
    def create_meeting(self, topic, start_time, duration, **kwargs):
        """Create a new Zoom meeting"""
        try:
            settings_dict = {
                'host_video': True,
                'participant_video': True,
                'join_before_host': False,
                'mute_upon_entry': True,
                'approval_type': 2,  # No registration required
                'registration_type': 1,
                'audio': 'both',
                'auto_recording': 'cloud',
                'waiting_room': True,
                'contact_name': 'University Management System',
                'contact_email': 'admin@university.edu'
            }
            
            settings_dict.update(kwargs.get('settings', {}))
            
            meeting_data = {
                'topic': topic,
                'type': 2,  # Scheduled meeting
                'start_time': start_time.isoformat(),
                'duration': duration,
                'timezone': 'UTC',
                'password': self._generate_meeting_password(),
                'agenda': kwargs.get('agenda', 'University Class'),
                'settings': settings_dict
            }
            
            response = self._make_request('POST', 'users/me/meetings', meeting_data)
            
            logger.info(f"Created Zoom meeting: {response.get('id')}")
            return {
                'meeting_id': response['id'],
                'topic': response['topic'],
                'join_url': response['join_url'],
                'start_url': response['start_url'],
                'password': response['password'],
                'start_time': response['start_time'],
                'duration': response['duration']
            }
            
        except Exception as e:
            logger.error(f"Error creating Zoom meeting: {e}")
            raise
    
    def get_meeting(self, meeting_id):
        """Get meeting details"""
        try:
            response = self._make_request('GET', f'meetings/{meeting_id}')
            return response
        except Exception as e:
            logger.error(f"Error getting Zoom meeting: {e}")
            raise
    
    def update_meeting(self, meeting_id, **kwargs):
        """Update meeting details"""
        try:
            response = self._make_request('PATCH', f'meetings/{meeting_id}', kwargs)
            logger.info(f"Updated Zoom meeting: {meeting_id}")
            return response
        except Exception as e:
            logger.error(f"Error updating Zoom meeting: {e}")
            raise
    
    def delete_meeting(self, meeting_id):
        """Delete a meeting"""
        try:
            response = self._make_request('DELETE', f'meetings/{meeting_id}')
            logger.info(f"Deleted Zoom meeting: {meeting_id}")
            return response
        except Exception as e:
            logger.error(f"Error deleting Zoom meeting: {e}")
            raise
    
    def get_meeting_recordings(self, meeting_id):
        """Get meeting recordings"""
        try:
            response = self._make_request('GET', f'meetings/{meeting_id}/recordings')
            return response
        except Exception as e:
            logger.error(f"Error getting meeting recordings: {e}")
            raise
    
    def _generate_meeting_password(self, length=6):
        """Generate a random meeting password"""
        import secrets
        import string
        return ''.join(secrets.choice(string.digits) for _ in range(length))


# Global Zoom client instance
zoom_client = ZoomAPIClient()


def create_zoom_class(class_data):
    """Create a Zoom class and return meeting details"""
    try:
        # Parse date and time
        from datetime import datetime
        schedule_date = class_data['schedule_date']
        start_time = class_data['start_time']
        
        # Combine date and time
        start_datetime = datetime.combine(schedule_date, start_time)
        
        # Create Zoom meeting
        meeting = zoom_client.create_meeting(
            topic=class_data['topic'],
            start_time=start_datetime,
            duration=class_data.get('duration_minutes', 60),
            agenda=f"Virtual class for {class_data.get('course_name', 'Course')}"
        )
        
        return {
            'success': True,
            'meeting_id': meeting['meeting_id'],
            'join_link': meeting['join_url'],
            'start_url': meeting['start_url'],
            'password': meeting['password']
        }
        
    except Exception as e:
        logger.error(f"Error creating Zoom class: {e}")
        return {
            'success': False,
            'error': str(e)
        }


def delete_zoom_meeting(meeting_id):
    """Delete a Zoom meeting"""
    try:
        zoom_client.delete_meeting(meeting_id)
        return {'success': True}
    except Exception as e:
        logger.error(f"Error deleting Zoom meeting: {e}")
        return {'success': False, 'error': str(e)}


def get_meeting_recordings(meeting_id):
    """Get recordings for a meeting"""
    try:
        recordings = zoom_client.get_meeting_recordings(meeting_id)
        return {
            'success': True,
            'recordings': recordings
        }
    except Exception as e:
        logger.error(f"Error getting meeting recordings: {e}")
        return {'success': False, 'error': str(e)}