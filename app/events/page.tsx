import { getEvents } from '@/lib/contentful';
import EventsClient from '@/components/EventsClient';

export default async function EventsPage() {
  const events = await getEvents();
  return <EventsClient events={events} />;
}
