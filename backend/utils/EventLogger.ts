import fs from 'fs';
import path from 'path';

interface Event {
  timestamp: string;
  event: string;
  description: string;
}

export class EventLogger {
  private static instance: EventLogger;
  private logFilePath: string;
  private events: Event[];

  private constructor() {
    this.logFilePath = path.resolve(__dirname, 'events.log');
    this.events = [];

    // Load existing events from file, if any
    this.loadEventsFromFile();
  }

  public static getInstance(): EventLogger {
    if (!EventLogger.instance) {
      EventLogger.instance = new EventLogger();
    }
    return EventLogger.instance;
  }

  private loadEventsFromFile(): void {
    try {
      const data = fs.readFileSync(this.logFilePath, 'utf-8');
      if (data) {
        this.events = JSON.parse(data);
      }
    } catch (err) {
      console.error('Error loading events from file:', err);
    }
  }

  private saveEventsToFile(): void {
    try {
      fs.writeFileSync(this.logFilePath, JSON.stringify(this.events, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving events to file:', err);
    }
  }

  public logEvent(event: string, description: string): void {
    const timestamp = new Date().toISOString();
    const newEvent: Event = { timestamp, event, description };
    this.events.push(newEvent);
    this.saveEventsToFile();
  }

  public getAllEvents(): Event[] {
    return this.events;
  }

  public clearAllEvents(): void {
    this.events = [];
    this.saveEventsToFile();
  }
}
