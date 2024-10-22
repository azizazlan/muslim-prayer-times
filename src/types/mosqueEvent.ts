interface MosqueEvent {
  id: number;
  eventText: string;
  date: string;
  repeat: boolean;
  repeatDays: string[];
}

export default MosqueEvent;