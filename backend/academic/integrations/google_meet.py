from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from django.conf import settings
from django.utils import timezone
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)


class GoogleMeetAPIClient:
    """Client for Google Calendar API to create Google Meet meetings"""
    
    def __init__(self):
        self.credentials_file = getattr(settings, 'GOOGLE_CREDENTIALS_FILE', None)
        self.delegated_email = getattr(settings, 'GOOGLE_DELEGATED_EMAIL', None)
        self.service = None
        # Authentication is deferred until a method requiring it is called
    
    def _authenticate(self):
        """Authenticate with Google Calendar API - called lazily when needed"""
        if self.service is not None:
            return self.service
        
        try:
            if self.credentials_file:
                # Use credentials file if provided
                credentials = service_account.Credentials.from_service_account_file(
                    self.credentials_file,
                    scopes=['https://www.googleapis.com/auth/calendar']
                )
            else:
                # Use individual settings from environment
                if not all([
                    hasattr(settings, 'GOOGLE_PROJECT_ID') and settings.GOOGLE_PROJECT_ID,
                    hasattr(settings, 'GOOGLE_PRIVATE_KEY_ID') and settings.GOOGLE_PRIVATE_KEY_ID,
                    hasattr(settings, 'GOOGLE_PRIVATE_KEY') and settings.GOOGLE_PRIVATE_KEY,
                    hasattr(settings, 'GOOGLE_CLIENT_EMAIL') and settings.GOOGLE_CLIENT_EMAIL,
                    hasattr(settings, 'GOOGLE_CLIENT_ID') and settings.GOOGLE_CLIENT_ID
                ]):
                    raise ValueError("Missing required Google service account settings in Django settings")
                
                credentials_dict = {
                    "type": "service_account",
                    "project_id": settings.GOOGLE_PROJECT_ID,
                    "private_key_id": settings.GOOGLE_PRIVATE_KEY_ID,
                    "private_key": settings.GOOGLE_PRIVATE_KEY.replace('\\n', '\n'),
                    "client_email": settings.GOOGLE_CLIENT_EMAIL,
                    "client_id": settings.GOOGLE_CLIENT_ID,
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                    "client_x509_cert_url": f"https://www.googleapis.com/robot/v1/metadata/x509/{settings.GOOGLE_CLIENT_EMAIL}"
                }
                
                credentials = service_account.Credentials.from_service_account_info(
                    credentials_dict,
                    scopes=['https://www.googleapis.com/auth/calendar']
                )
            
            # Delegate credentials if needed (domain-wide delegation)
            if self.delegated_email:
                credentials = credentials.with_subject(self.delegated_email)
            
            self.service = build('calendar', 'v3', credentials=credentials)
            logger.info("Successfully authenticated with Google Calendar API")
            
        except Exception as e:
            logger.error(f"Error authenticating with Google Calendar API: {e}")
            self.service = None
            raise
    
    def create_meeting(self, topic, start_time, duration, **kwargs):
        """Create a Google Meet meeting"""
        self._authenticate()
        
        try:
            # Calculate end time
            end_time = start_time + timedelta(minutes=duration)
            
            # Create event
            event = {
                'summary': topic,
                'description': kwargs.get('description', 'University Virtual Class'),
                'start': {
                    'dateTime': start_time.isoformat(),
                    'timeZone': 'UTC',
                },
                'end': {
                    'dateTime': end_time.isoformat(),
                    'timeZone': 'UTC',
                },
                'conferenceData': {
                    'createRequest': {
                        'conferenceSolutionKey': {
                            'type': 'hangoutsMeet'
                        },
                        'requestId': f'university-meet-{int(start_time.timestamp())}'
                    }
                },
                'attendees': kwargs.get('attendees', []),
                'reminders': {
                    'useDefault': False,
                    'overrides': [
                        {'method': 'email', 'minutes': 24 * 60},
                        {'method': 'popup', 'minutes': 10},
                    ],
                },
            }
            
            # Insert event
            event = self.service.events().insert(
                calendarId='primary',
                body=event,
                conferenceDataVersion=1,
                sendUpdates='all'
            ).execute()
            
            # Extract meeting details
            meet_link = None
            if 'conferenceData' in event:
                entry_points = event['conferenceData'].get('entryPoints', [])
                for entry_point in entry_points:
                    if entry_point['entryPointType'] == 'video':
                        meet_link = entry_point['uri']
                        break
            
            logger.info(f"Created Google Meet: {event.get('id')}")
            
            return {
                'meeting_id': event['id'],
                'topic': event['summary'],
                'join_link': meet_link,
                'start_time': event['start']['dateTime'],
                'end_time': event['end']['dateTime'],
                'html_link': event['htmlLink']
            }
            
        except HttpError as e:
            logger.error(f"Google Calendar API error: {e}")
            raise
        except Exception as e:
            logger.error(f"Error creating Google Meet: {e}")
            raise
    
    def get_meeting(self, event_id):
        """Get meeting details"""
        self._authenticate()
        
        try:
            event = self.service.events().get(
                calendarId='primary',
                eventId=event_id
            ).execute()
            
            return event
            
        except HttpError as e:
            logger.error(f"Google Calendar API error: {e}")
            raise
        except Exception as e:
            logger.error(f"Error getting Google Meet: {e}")
            raise
    
    def update_meeting(self, event_id, **kwargs):
        """Update meeting details"""
        self._authenticate()
        
        try:
            # Get existing event
            event = self.get_meeting(event_id)
            
            # Update fields
            if 'topic' in kwargs:
                event['summary'] = kwargs['topic']
            
            if 'start_time' in kwargs:
                event['start']['dateTime'] = kwargs['start_time'].isoformat()
            
            if 'duration' in kwargs and 'start_time' in kwargs:
                end_time = kwargs['start_time'] + timedelta(minutes=kwargs['duration'])
                event['end']['dateTime'] = end_time.isoformat()
            
            if 'description' in kwargs:
                event['description'] = kwargs['description']
            
            # Update event
            updated_event = self.service.events().update(
                calendarId='primary',
                eventId=event_id,
                body=event
            ).execute()
            
            logger.info(f"Updated Google Meet: {event_id}")
            return updated_event
            
        except HttpError as e:
            logger.error(f"Google Calendar API error: {e}")
            raise
        except Exception as e:
            logger.error(f"Error updating Google Meet: {e}")
            raise
    
    def delete_meeting(self, event_id):
        """Delete a meeting"""
        self._authenticate()
        
        try:
            self.service.events().delete(
                calendarId='primary',
                eventId=event_id
            ).execute()
            
            logger.info(f"Deleted Google Meet: {event_id}")
            
        except HttpError as e:
            logger.error(f"Google Calendar API error: {e}")
            raise
        except Exception as e:
            logger.error(f"Error deleting Google Meet: {e}")
            raise
    
    def list_upcoming_meetings(self, max_results=10):
        """List upcoming meetings"""
        self._authenticate()
        
        try:
            now = datetime.utcnow()
            time_max = now + timedelta(days=30)
            
            events_result = self.service.events().list(
                calendarId='primary',
                timeMin=now.isoformat() + 'Z',
                timeMax=time_max.isoformat() + 'Z',
                maxResults=max_results,
                singleEvents=True,
                orderBy='startTime'
            ).execute()
            
            events = events_result.get('items', [])
            
            # Filter for meetings with Google Meet
            meetings = []
            for event in events:
                if 'conferenceData' in event:
                    entry_points = event['conferenceData'].get('entryPoints', [])
                    for entry_point in entry_points:
                        if entry_point['entryPointType'] == 'video':
                            meetings.append({
                                'event_id': event['id'],
                                'summary': event.get('summary', 'No title'),
                                'start_time': event['start'].get('dateTime'),
                                'meet_link': entry_point['uri'],
                                'html_link': event.get('htmlLink')
                            })
                            break
            
            return meetings
            
        except HttpError as e:
            logger.error(f"Google Calendar API error: {e}")
            raise
        except Exception as e:
            logger.error(f"Error listing Google Meets: {e}")
            raise


def create_google_meet_class(class_data):
    """Create a Google Meet class"""
    try:
        # Create a new client instance only when needed
        meet_client = GoogleMeetAPIClient()
        
        # Parse date and time
        schedule_date = class_data['schedule_date']
        start_time = class_data['start_time']
        
        # Combine date and time
        start_datetime = datetime.combine(schedule_date, start_time)
        
        # Create Google Meet
        meeting = meet_client.create_meeting(
            topic=class_data['topic'],
            start_time=start_datetime,
            duration=class_data.get('duration_minutes', 60),
            description=f"Virtual class for {class_data.get('course_name', 'Course')}"
        )
        
        return {
            'success': True,
            'meeting_id': meeting['meeting_id'],
            'join_link': meeting['join_link'],
            'start_url': meeting['join_link'],  # Google Meet uses same link for host and attendees
            'html_link': meeting['html_link']
        }
        
    except Exception as e:
        logger.error(f"Error creating Google Meet class: {e}")
        return {
            'success': False,
            'error': str(e)
        }


def delete_google_meet(event_id):
    """Delete a Google Meet"""
    try:
        meet_client = GoogleMeetAPIClient()
        meet_client.delete_meeting(event_id)
        return {'success': True}
    except Exception as e:
        logger.error(f"Error deleting Google Meet: {e}")
        return {'success': False, 'error': str(e)}


def get_meeting_link(event_id):
    """Get meeting link for a Google Meet"""
    try:
        meet_client = GoogleMeetAPIClient()
        event = meet_client.get_meeting(event_id)
        
        meet_link = None
        if 'conferenceData' in event:
            entry_points = event['conferenceData'].get('entryPoints', [])
            for entry_point in entry_points:
                if entry_point['entryPointType'] == 'video':
                    meet_link = entry_point['uri']
                    break
        
        return {
            'success': True,
            'meet_link': meet_link
        }
        
    except Exception as e:
        logger.error(f"Error getting Google Meet link: {e}")
        return {'success': False, 'error': str(e)}