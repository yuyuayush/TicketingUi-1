export type UserRole = "ADMIN" | "USER" | "THEATER_OWNER";

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  role?: UserRole;
  avatarId?: string;
  bio?: string;
}

export interface SeatMapProps {
  seats: any[];
  toggleSeat: (seat: any) => void;
  selectedSeats: any[];
  locked: boolean;
}


export interface SeatButtonProps {
  seat: any;
  toggleSeat: (seat: any) => void;
  selectedSeats: any[];
  locked: boolean;
}

export interface BookingPanelProps {
  selectedSeats: any[];
  totalAmount: number;
  locked: boolean;
  timer: number;
  handleLockSeats: () => void;
  handleUnlockSeats: () => void;
}



export interface IStripePaymentInitiatePayload {
  amount: number;
  currency?: string;
  productName?: string;
}

export interface ApiStripeResponse {
  url: string;
  isLoading: boolean
}

export interface UserDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  formData: IUserFormData;
  setFormData: React.Dispatch<React.SetStateAction<IUserFormData>>;
  editUser: IUser | null;
  handleSave: () => Promise<void>;
  isPending: boolean;
}


export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole; // Assuming typical roles
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}


export interface IUpdateProfileData {
  name?: string;
  phone?: string;
}

export interface IUpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}


export interface IAdminUpdateUserData {
  name?: string;
  email?: string;
  phone?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface IResetPasswordData {
  newPassword: string;
}

export interface ConcertTableProps {
  concerts: IConcertDisplay[];
  isLoading: boolean;
  onEdit: (concert: IConcertDisplay) => void;
  onDelete: (id: string) => void;
  onView: (concert: IConcertDisplay) => void; // New prop
}


export interface IBooking {
  _id: string;
  concertId: string;
  seats: string[];
  status: "confirmed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}



export interface IConcertFormData {
  id?: string;
  title: string;
  artist: string;
  genre: string;
  startTime: string; // ISO string format for date picker
  endTime: string;   // ISO string format for date picker
  theaterId: string;
  basePrice: number;
  totalTickets?: number;       // Added
  description: string;
  image?: File | null;         // Added
  isPublished: boolean;
  imageUrl?: string;
}

export interface IUserFormData {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  newPassword?: string;
}

export interface UserStoreState {
  // State
  editUser: IUser | null;
  isDialogOpen: boolean;
  formData: IUserFormData;

  // Actions
  openDialog: (user?: IUser) => void;
  closeDialog: () => void;
  setFormData: (data: IUserFormData) => void;
  resetFormData: () => void;
}

export interface IConcertDisplay {
  _id: string;
  title: string;
  artist: string;
  genre: string;
  startTime: string;
  endTime: string;
  basePrice: number;
  isPublished: boolean;
  description: string;
  theaterId: {
    _id: string;
    name: string;
    city: any;
  } | string; // Can be object (populated) or string (unpopulated)
}


export interface IGetAllUsersParams {
  search?: string;
  page?: number;
  limit?: number;
}

export interface IConcertFormData {
  _id?: string;
  id?: string;
  title: string;
  artist: string;
  genre: string;
  startTime: string;
  endTime: string;
  theaterId: string;
  basePrice: number;
  description: string;
  isPublished: boolean;
  totalTickets?: number;
  image?: File | null;
  imageUrl?: string;
}

export interface ConcertDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  formData: IConcertFormData;
  setFormData: React.Dispatch<React.SetStateAction<IConcertFormData>>;
  editConcert: any | null;
  handleSave: (formData: IConcertFormData) => void;
  isPending: boolean;
}

export interface IConcertData {
  title: string;
  description: string;
  artist: string;
  genre: string;
  startTime: Date | string;
  endTime: Date | string;
  theaterId: string;
  basePrice: number;
  isPublished: boolean;
}


export interface ISeat {
  _id: string;
  concert: string; // Concert ID
  seatNumber: string;
  row: string;
  column: number;
  seatType: 'gold' | 'silver' | 'platinum';
  status: 'AVAILABLE' | 'RESERVED';
  price: number;
  lockedBy?: string | null; // User ID if locked
  booking?: string; // Booking ID if booked
  createdAt?: string;
  updatedAt?: string;
  lockedAt?: Date | string | number | null;
}

export interface ISeatCreatePayload {
  seatNumber: string;
  row: string;
  column: number;
  seatType: 'gold' | 'silver' | 'platinum';
  price: number;
}

export interface ISeatLockPayload {
  concertId: string | string[] | undefined | null;
  seatIds: string[];
}

export interface ISeatUnlockPayload {
  concertId: string | string[] | undefined | null;
  seatIds: string[];
}



export interface IPaymentInitiatePayload {
  concertId: string;
  seatIds: string[];
  amount: number;
  userId: string;
}

export interface IPaymentVerifyPayload {
  paymentId: string;
  orderId: string;
}

export interface IPaymentRefundPayload {
  paymentId: string;
  reason?: string;
}

export interface EventType {
  _id: string;
  name: string;
  location: string;
  eventDate: number;
  price: number;
  image?: string;
  description?: string;
  userId?: string;
  totalTickets: number;
  purchasedCount: number;
  activeOffers?: number;
}


export interface EventType {
  _id: string;
  name: string;
  eventDate: number;
  location: string;
  price: number;
  is_cancelled?: boolean;
  image?: string
}


export interface ConcertAdminStoreState {
  // Dialog & Edit states
  editConcert: IConcertDisplay | null;
  viewConcert: IConcertDisplay | null;
  isEditOpen: boolean;
  isViewOpen: boolean;

  // Form data
  formData: IConcertFormData;

  // Functions
  openEditDialog: (concert?: IConcertDisplay) => void;
  closeEditDialog: () => void;
  openViewDialog: (concert: IConcertDisplay) => void;
  closeViewDialog: () => void;
  setFormData: (data: Partial<IConcertFormData>) => void; // Use Partial for updates
  resetFormData: () => void;
}


export interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;

  setUser: (user: User | null) => void;
  setInitialized: (value: boolean) => void;
  resetAuth: () => void;
}



export interface TicketType {
  _id: string;
  status: "valid" | "used" | "refunded" | "cancelled";
  purchasedAt: number;
  event: EventType;
}

export interface TicketCardProps {
  ticket: TicketType;
}

export interface VideoData {
  apiVideoId?: string;
  embedUrl?: string;
  playerUrl?: string;
  thumbnailUrl?: string;
  hlsUrl?: string;
  mp4Url?: string;
  duration?: number;
  isProcessing?: boolean;
}

export interface QuizQuestion {
  question: string;
  type: 'single' | 'multiple';
  options: string[];
  correctAnswers: number[];
  explanation?: string;
}

export interface QuizData {
  isGraded?: boolean;
  instructions?: string;
  timeLimit?: number;
  passingScore?: number;
  shuffleQuestions?: boolean;
  showCorrectAnswers?: boolean;
  questions: QuizQuestion[];
}

export interface NoteData {
  content?: string;
  attachments?: Array<{
    name: string;
    url: string;
    type: string;
    size?: number;
  }>;
}

export interface Lecture {
  id?: string;
  _id?: string; // MongoDB ID
  title: string;
  description?: string;
  type: "video" | "quiz" | "note";
  order?: number;
  isPreview?: boolean;
  duration: number; // in minutes

  // Video lecture fields
  video?: VideoData;

  // Quiz lecture fields
  quiz?: QuizData;

  // Note lecture fields
  note?: NoteData;

  // Common resources
  resources?: Array<{
    name: string;
    url: string;
    type: string;
  }>;

  // Legacy fields for backward compatibility
  content?: string;
}

export interface Section {
  id?: string;
  _id?: string; // MongoDB ID
  title: string;
  lectures: Lecture[];
}

export interface Course {
  _id: string;
  id?: string; // For backward compatibility
  title: string;
  description: string;
  shortDescription?: string;
  category: string | { _id: string; name: string };
  instructor: string;
  instructorId?: string; // For backward compatibility
  price: number;
  originalPrice?: number;
  thumbnail?: {
    url: string;
    publicId: string;
  };
  banner?: {
    url: string;
    publicId: string;
  };
  demoVideo?: {
    url: string;
    publicId: string;
  };
  thumbnailId?: string; // For backward compatibility
  bannerId?: string; // For backward compatibility
  previewVideoUrl?: string; // For backward compatibility
  requirements?: string[];
  whatYouWillLearn?: string[];
  level?: 'beginner' | 'intermediate' | 'advanced';
  status: 'draft' | 'published';
  isPublished: boolean;
  sections: Section[];
  totalDuration?: number;
  enrollmentCount?: number;
  averageRating?: number;
  certificate?: {
    enabled: boolean;
    completionRequirement: number;
    passingScore: number;
    signedBy: {
      name: string;
      title: string;
      signature: string;
    };
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  progress: number; // percentage
  completed: boolean;
  enrollmentDate: string;
}

export interface Review {
  id: string;
  userId: string;
  courseId: string;
  rating: number; // 1-5
  comment: string;
  date: string;
}

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  issueDate: string;
}

export interface WishlistItem {
  userId: string;
  courseId: string;
}

export interface CartItem {
  userId: string;
  courseId: string;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  lectureId: string;
  score: number;
  timestamp: string;
}
