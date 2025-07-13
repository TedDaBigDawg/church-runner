import {
  Clock,
  Calendar,
  Users,
  Heart,
  BookOpen,
  Music,
  FileText,
  Target,
  Droplets,
  MessageCircle,
  CroissantIcon as Bread,
  BellRingIcon as Rings,
  Phone,
  MapPin,
  ChevronRight,
} from "lucide-react";

export const services = [
  {
    id: "1",
    title: "Sunday Mass",
    description:
      "Our main worship service featuring traditional liturgy, inspiring sermons, and beautiful music.",
    dayOfWeek: 0,
    time: "10:00",
    duration: "90 minutes",
    icon: Heart,
    attendees: "200-300",
    category: "Worship",
  },
  {
    id: "2",
    title: "Wednesday Bible Study",
    description:
      "Deep dive into Scripture with discussion, prayer, and fellowship in small groups.",
    dayOfWeek: 3,
    time: "18:30",
    duration: "60 minutes",
    icon: BookOpen,
    attendees: "30-50",
    category: "Study",
  },
  {
    id: "3",
    title: "Friday Youth Service",
    description:
      "Contemporary worship designed for teens and young adults with modern music and relevant messages.",
    dayOfWeek: 5,
    time: "17:00",
    duration: "75 minutes",
    icon: Users,
    attendees: "40-60",
    category: "Youth",
  },
  {
    id: "4",
    title: "Saturday Choir Practice",
    description:
      "Weekly rehearsal preparing beautiful music for Sunday worship. New members welcome!",
    dayOfWeek: 6,
    time: "16:00",
    duration: "120 minutes",
    icon: Music,
    attendees: "15-25",
    category: "Music",
  },
];

export const sacraments = [
  {
    title: "Baptism",
    description:
      "A sacred ceremony welcoming new members into our faith community. Held monthly with preparation classes available.",
    schedule: "First Sunday of each month",
    contact: "Contact church office to schedule",
    icon: Droplets,
    color: "bg-gradient-to-r from-primary rounded-t-xl to-[#1a1a1a]",
  },
  {
    title: "Confession",
    description:
      "Private consultation with our priest for spiritual guidance, forgiveness, and peace of mind.",
    schedule: "Saturdays 4:00-5:00 PM",
    contact: "Walk-ins welcome or by appointment",
    icon: MessageCircle,
    color: "bg-gradient-to-r from-primary rounded-t-xl to-[#1a1a1a]",
  },
  {
    title: "Holy Communion",
    description:
      "The central sacrament of our faith, celebrating Christ's presence among us through bread and wine.",
    schedule: "Every Sunday during Mass",
    contact: "Open to all baptized Christians",
    icon: Bread,
    color: "bg-gradient-to-r from-primary rounded-t-xl to-[#1a1a1a]",
  },
  {
    title: "Matrimony",
    description:
      "Sacred wedding ceremonies in our beautiful sanctuary. Pre-marriage counseling included.",
    schedule: "By appointment",
    contact: "Schedule 6 months in advance",
    icon: Rings,
    color: "bg-gradient-to-r from-primary rounded-t-xl to-[#1a1a1a]",
  },
];

export const DASHBOARD_OVERVIEW_CARDS = [
  {
    title: "Mass Intentions",
    description: "Request Mass intentions for your loved ones.",
    href: "/dashboard/mass-intentions",
  },
  {
    title: "Thanksgiving",
    description: "Book thanksgiving services for special occasions.",
    href: "/dashboard/thanksgiving",
  },
  {
    title: "Donations",
    description: "Support our church through donations and offerings.",
    href: "/dashboard/payments",
  },
  {
    title: "Events",
    description: "View and RSVP to upcoming church events.",
    href: "/dashboard/events",
  },
];

export const DASHBOARD_QUICK_ACTIONS = [
  {
    href: "/dashboard/mass-intentions/new",
    icon: <Calendar className="h-5 w-5 mr-2 text-background" />,
    label: "Book Intentions",
    primary: true,
    ariaLabel: "Book a Mass intention",
  },
  {
    href: "/dashboard/thanksgiving/new",
    icon: <Target className="h-5 w-5 mr-2 text-background" />,
    label: "Book Thanksgiving",
    primary: true,
    ariaLabel: "Book a Thanksgiving",
  },
  {
    href: "/dashboard/donations/new",
    icon: <FileText className="h-5 w-5 mr-2 text-primary" />,
    label: "Make Donation",
    ariaLabel: "Make a donation",
  },
  {
    href: "/dashboard/thanksgiving",
    icon: <Heart className="h-5 w-5 mr-2 text-primary" />,
    label: "Manage Thanksgivings",
    ariaLabel: "Manage your Thanksgivings",
  },
];
