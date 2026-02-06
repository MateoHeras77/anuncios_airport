export type Category = {
  id: string;
  label: string;
  order: number;
};

export type Announcement = {
  id: string;
  title: string;
  content: string[];
  categoryId: string;
  active: boolean;
};

export const categories: Category[] = [
  { id: "boarding", label: "Boarding", order: 1 },
  { id: "delay", label: "Delays", order: 2 },
  { id: "arrival", label: "Arrivals", order: 3 },
  { id: "safety", label: "Safety", order: 4 }
];

export const announcements: Announcement[] = [
  {
    id: "board-1",
    title: "Initial boarding call",
    categoryId: "boarding",
    active: true,
    content: [
      "Welcome aboard. We are now inviting passengers in Group 1 and Group 2 to begin boarding.",
      "Please have your boarding pass and identification ready.",
      "All other passengers may remain seated until their group is called."
    ]
  },
  {
    id: "board-2",
    title: "Final boarding call",
    categoryId: "boarding",
    active: true,
    content: [
      "This is the final boarding call for Flight AZ102 to São Paulo.",
      "All remaining passengers should proceed immediately to Gate 12.",
      "The aircraft door will close in five minutes."
    ]
  },
  {
    id: "delay-1",
    title: "Departure delay",
    categoryId: "delay",
    active: true,
    content: [
      "We regret to inform you that Flight AZ102 is delayed due to operational reasons.",
      "The new estimated departure time is 18:40.",
      "Thank you for your patience while we prepare the aircraft."
    ]
  },
  {
    id: "arrival-1",
    title: "Arrival gate update",
    categoryId: "arrival",
    active: true,
    content: [
      "Flight AZ215 has arrived and is taxiing to Gate 8.",
      "Please allow arriving passengers to exit first before approaching the gate area."
    ]
  },
  {
    id: "safety-1",
    title: "Safety reminder",
    categoryId: "safety",
    active: true,
    content: [
      "For your safety, please keep the gate area clear of unattended baggage.",
      "Report any suspicious items to airport security immediately."
    ]
  }
];
