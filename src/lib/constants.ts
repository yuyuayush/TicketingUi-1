import { EventType, TicketType } from "./types";

export const NAVLINKS = [
  { name: "Courses", path: "#courses" },
  { name: "Instructor", path: "/instructor" },
  { name: "Resources", path: "/Resources" },
];

export const tel = "23 9622 0988";
export const email = "info@jandgpainting.com.au";



export const dummyEvents: EventType[] = [
  {
    _id: "1",
    name: "Arijit Singh Live Concert",
    location: "Mumbai, India",
    eventDate: Date.now() + 5 * 24 * 60 * 60 * 1000,
    price: 1999,
    image: "/poster2.jpg",
    description: "An unforgettable night with Arijit Singh performing live.",
    userId: "user123",
    totalTickets: 100,
    purchasedCount: 20,
    activeOffers: 5,
  },
  {
    _id: "2",
    name: "Sunburn Music Festival",
    location: "Goa, India",
    eventDate: Date.now() + 15 * 24 * 60 * 60 * 1000,
    price: 3499,
    image: "/poster2.jpg",
    description: "Asia’s biggest EDM festival with top DJs performing live.",
    userId: "user456",
    totalTickets: 200,
    purchasedCount: 150,
    activeOffers: 10,
  },
  {
    _id: "3",
    name: "India vs Australia T20 Match",
    location: "Delhi Stadium",
    eventDate: Date.now() - 10 * 24 * 60 * 60 * 1000,
    price: 1499,
    image: "/poster2.jpg",
    description: "Catch the thrilling action live as India takes on Australia.",
    userId: "user789",
    totalTickets: 500,
    purchasedCount: 500,
    activeOffers: 0,
  },
  {
    _id: "4",
    name: "Stand-Up Comedy Night ft. Zakir Khan",
    location: "Bangalore, India",
    eventDate: Date.now() + 3 * 24 * 60 * 60 * 1000,
    price: 899,
    image: "/poster2.jpg",
    description: "Laugh out loud with top comedians performing live on stage.",
    userId: "user123",
    totalTickets: 120,
    purchasedCount: 50,
    activeOffers: 3,
  },
  {
    _id: "5",
    name: "Bollywood Retro Musical Evening",
    location: "Hyderabad, India",
    eventDate: Date.now() - 25 * 24 * 60 * 60 * 1000,
    price: 999,
    image: "/poster2.jpg",
    description: "Step back in time with Bollywood classics and live music.",
    userId: "user456",
    totalTickets: 150,
    purchasedCount: 150,
    activeOffers: 0,
  },
  {
    _id: "6",
    name: "Startup Tech Conference 2025",
    location: "Bengaluru Convention Center",
    eventDate: Date.now() + 30 * 24 * 60 * 60 * 1000,
    price: 2499,
    image: "/poster2.jpg",
    description: "Meet founders, investors, and innovators shaping the future.",
    userId: "user123",
    totalTickets: 300,
    purchasedCount: 80,
    activeOffers: 15,
  },
];


export const dummyTickets: TicketType[] = [
  {
    _id: "ticket1",
    status: "valid",
    purchasedAt: Date.now() - 1000 * 60 * 60 * 24,
    event: {
      _id: "event1",
      name: "Rock Concert 2025",
      eventDate: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week from now
      location: "Stadium A",
      price: 49.99,
      is_cancelled: false,
      image: "/concert.jpg",
    },
  },
  {
    _id: "ticket2",
    status: "valid",
    purchasedAt: Date.now() - 1000 * 60 * 60 * 48,
    event: {
      _id: "event2",
      name: "Football Match",
      eventDate: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
      location: "Arena B",
      price: 75.5,
      image: "/football.jpg",
    },
  },
  {
    _id: "ticket3",
    status: "cancelled",
    purchasedAt: Date.now() - 1000 * 60 * 60 * 72,
    event: {
      _id: "event3",
      name: "Theatre Play",
      eventDate: Date.now() + 1000 * 60 * 60 * 24 * 10, // 10 days from now
      location: "Theatre C",
      price: 35.0,
      image: "/theatre.jpg",
    },
  },
];


