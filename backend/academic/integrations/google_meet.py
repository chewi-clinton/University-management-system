from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from django.conf import settings
from django.utils import timezone
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)


class GoogleMeetAPIClient:
    """Client for Google Calendar API to create and manage Google Meet meetings"""

    def __init__(self):
        self.credentials_file = getattr(settings, 'GOOGLE_CREDENTIALS_FILE', None)
        self.delegated_email = getattr(settings, 'GOOGLE_DELEGATED_EMAIL', None)
        self.service = None  # Lazy initialization

    def _authenticate(self):
        """Authenticate with Google Calendar API - called only when needed"""
        if self.service is not None:
            return

        try:
            if self.credentials_file:
                credentials = service_account.Credentials.from_service_account_file(
                    self.credentials_file,
                    scopes=['https://www.googleapis.com/auth/calendar']
                )
            else:
                required_keys = [
                    'GOOGLE_PROJECT_ID', 'GOOGLE_PRIVATE_KEY_ID', 'GOOGLE_PRIVATE_KEY',
                    'GOOGLE_CLIENT_EMAIL', 'GOOGLE_CLIENT_ID'
                ]
                missing = [k for k in required_keys if not hasattr(settings, k) or not getattr(settings, k)]
                if missing:
                    raise ValueError(f"Missing Google service account settings: {', '.join(missing)}")

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

            if self.delegated_email:
                credentials = credentials.with_subject(self.delegated_email)

            self.service = build('calendar', 'v3', credentials=credentials)
            logger.info("Google Calendar API client authenticated successfully")

        except Exception as e:
            logger.error(f"Google Calendar authentication failed: {e}", exc_info=True)
            raise

    def create_meeting(self, topic, start_time, duration, **kwargs):
        """
        Create a Google Meet meeting via Google Calendar event.
        Uses automatic hangoutLink generation (reliable fallback) + conferenceData support.
        """
        self._authenticate()

        try:
            # Ensure start_time is timezone-aware (UTC)
            if start_time.tzinfo is None:
                start_time = start_time.replace(tzinfo=timezone.utc)

            end_time = start_time + timedelta(minutes=duration)

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
                'attendees': kwargs.get('attendees', []),
                'reminders': {
                    'useDefault': False,
                    'overrides': [
                        {'method': 'email', 'minutes': 24 * 60},  # 24 hours before
                        {'method': 'popup', 'minutes': 10},
                    ],
                },
                # Optional: Explicit conference data (modern way)
                'conferenceData': {
                    'createRequest': {
                        'requestId': f'university-meet-{int(start_time.timestamp())}-{topic[:20]}',
                        'conferenceSolutionKey': {'type': 'hangoutsMeet'},
                    }
                },
            }

            created_event = self.service.events().insert(
                calendarId='primary',
                body=event,
                conferenceDataVersion=1,  # Enables conferenceData (Meet link)
                sendUpdates=kwargs.get('send_updates', 'none')
            ).execute()

            # Primary method: Google often auto-generates hangoutLink
            meet_link = created_event.get('hangoutLink', '')

            # Fallback: Extract from conferenceData (more reliable in newer API versions)
            if not meet_link and 'conferenceData' in created_event:
                entry_points = created_event['conferenceData'].get('entryPoints', [])
                for entry in entry_points:
                    if entry.get('entryPointType') == 'video':
                        meet_link = entry.get('uri')
                        break

            # Last resort fallback: calendar link (at least user can open it)
            if not meet_link:
                logger.warning(f"No direct Meet link generated for event {created_event['id']}")
                meet_link = created_event.get('htmlLink', '')

            logger.info(f"Created Google Meet event: {created_event['id']} | Link: {meet_link}")

            return {
                'success': True,
                'meeting_id': created_event['id'],
                'topic': created_event['summary'],
                'join_link': meet_link,
                'start_url': meet_link,  # Same link for host & participants
                'start_time': created_event['start']['dateTime'],
                'end_time': created_event['end']['dateTime'],
                'html_link': created_event.get('htmlLink'),
            }

        except HttpError as e:
            error_content = e.content.decode('utf-8') if e.content else str(e)
            logger.error(f"Google Calendar API error: {error_content}")
            raise
        except Exception as e:
            logger.error(f"Unexpected error creating Google Meet: {e}", exc_info=True)
            raise

    def get_meeting(self, event_id):
        """Retrieve details of an existing Google Meet event"""
        self._authenticate()
        try:
            event = self.service.events().get(
                calendarId='primary',
                eventId=event_id
            ).execute()
            return event
        except HttpError as e:
            logger.error(f"Failed to get Google Meet event {event_id}: {e}")
            raise
        except Exception as e:
            logger.error(f"Error retrieving Google Meet: {e}")
            raise

    def update_meeting(self, event_id, **kwargs):
        """Update an existing Google Meet event"""
        self._authenticate()
        try:
            event = self.get_meeting(event_id)

            if 'topic' in kwargs:
                event['summary'] = kwargs['topic']
            if 'description' in kwargs:
                event['description'] = kwargs['description']
            if 'start_time' in kwargs:
                event['start']['dateTime'] = kwargs['start_time'].isoformat()
            if 'duration' in kwargs and 'start_time' in kwargs:
                end_time = kwargs['start_time'] + timedelta(minutes=kwargs['duration'])
                event['end']['dateTime'] = end_time.isoformat()

            updated_event = self.service.events().update(
                calendarId='primary',
                eventId=event_id,
                body=event,
                conferenceDataVersion=1
            ).execute()

            logger.info(f"Updated Google Meet event: {event_id}")
            return updated_event

        except HttpError as e:
            logger.error(f"Update failed for event {event_id}: {e}")
            raise
        except Exception as e:
            logger.error(f"Error updating Google Meet: {e}")
            raise

    def delete_meeting(self, event_id):
        """Delete a Google Meet event"""
        self._authenticate()
        try:
            self.service.events().delete(
                calendarId='primary',
                eventId=event_id
            ).execute()
            logger.info(f"Deleted Google Meet event: {event_id}")
            return {'success': True}
        except HttpError as e:
            logger.error(f"Delete failed for event {event_id}: {e}")
            raise
        except Exception as e:
            logger.error(f"Error deleting Google Meet: {e}")
            raise

    def list_upcoming_meetings(self, max_results=10):
        """List upcoming Google Meet events with video links"""
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
            meetings = []

            for event in events:
                meet_link = event.get('hangoutLink')
                if not meet_link and 'conferenceData' in event:
                    for entry in event['conferenceData'].get('entryPoints', []):
                        if entry.get('entryPointType') == 'video':
                            meet_link = entry['uri']
                            break

                if meet_link:
                    meetings.append({
                        'event_id': event['id'],
                        'summary': event.get('summary', 'No title'),
                        'start_time': event['start'].get('dateTime'),
                        'meet_link': meet_link,
                        'html_link': event.get('htmlLink')
                    })

            return meetings

        except HttpError as e:
            logger.error(f"List upcoming meetings failed: {e}")
            raise
        except Exception as e:
            logger.error(f"Error listing Google Meets: {e}")
            raise


def create_google_meet_class(class_data):
    """High-level function to create a Google Meet class from validated data"""
    try:
        meet_client = GoogleMeetAPIClient()

        schedule_date = class_data['schedule_date']
        start_time = class_data['start_time']

        if isinstance(schedule_date, str):
            schedule_date = datetime.strptime(schedule_date, '%Y-%m-%d').date()
        if isinstance(start_time, str):
            start_time = datetime.strptime(start_time, '%H:%M').time()

        start_datetime = datetime.combine(schedule_date, start_time)
        if start_datetime.tzinfo is None:
            start_datetime = start_datetime.replace(tzinfo=timezone.utc)

        meeting = meet_client.create_meeting(
            topic=class_data['topic'],
            start_time=start_datetime,
            duration=class_data.get('duration_minutes', 60),
            description=class_data.get('description', 'University Virtual Class'),
            attendees=class_data.get('attendees', [])
        )

        return {
            'success': True,
            'meeting_id': meeting['meeting_id'],
            'join_link': meeting['join_link'],
            'start_url': meeting['join_link'],
            'html_link': meeting.get('html_link')
        }

    except Exception as e:
        logger.error(f"Failed to create Google Meet class: {e}", exc_info=True)
        return {
            'success': False,
            'error': str(e)
        }


def delete_google_meet(event_id):
    """Delete a Google Meet event by ID"""
    try:
        meet_client = GoogleMeetAPIClient()
        meet_client.delete_meeting(event_id)
        return {'success': True}
    except Exception as e:
        logger.error(f"Failed to delete Google Meet {event_id}: {e}")
        return {'success': False, 'error': str(e)}


def get_meeting_link(event_id):
    """Retrieve the Google Meet join link for an event"""
    try:
        meet_client = GoogleMeetAPIClient()
        event = meet_client.get_meeting(event_id)

        meet_link = event.get('hangoutLink')
        if not meet_link and 'conferenceData' in event:
            for entry in event['conferenceData'].get('entryPoints', []):
                if entry.get('entryPointType') == 'video':
                    meet_link = entry.get('uri')
                    break

        return {
            'success': True,
            'meet_link': meet_link,
            'event': event
        }
    except Exception as e:
        logger.error(f"Failed to get Google Meet link for {event_id}: {e}")
        return {'success': False, 'error': str(e)}