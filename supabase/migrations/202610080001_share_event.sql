alter table analytics_events drop constraint if exists analytics_events_event_name_check;
alter table analytics_events add constraint analytics_events_event_name_check check (event_name in (
  'landing_view', 'rooms_view', 'room_entered', 'session_started',
  'first_message_sent', 'message_sent', 'reaction_sent',
  'reaction_received', 'session_completed', 'session_restarted',
  'share_clicked'
));
