import { ApiStripeResponse, IAdminUpdateUserData, IBooking, IConcertData, IGetAllUsersParams, IPaymentInitiatePayload, IPaymentRefundPayload, IPaymentVerifyPayload, IResetPasswordData, ISeat, ISeatCreatePayload, ISeatLockPayload, ISeatUnlockPayload, IStripePaymentInitiatePayload, IUpdatePasswordData, IUpdateProfileData, IUser, User } from "./types";

// API service layer for connecting frontend to backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

interface ApiResponse<T = any> {
    message?: string;
    token?: string;
    user?: any;
    data?: T;
    [key: string]: any;
}




class ApiError extends Error {
    status: number;
    data: any;

    constructor(message: string, status: number, data: any = null) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

// Token management
const getToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('ticketing-token');
    }
    return null;
};

const setToken = (token: string): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('ticketing-token', token);
    }
};

const removeToken = (): void => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('ticketing-token');
    }
};

// Base API request function
const apiRequest = async <T = any>(
    endpoint: string,
    options: RequestInit & { responseType?: "json" | "blob" } = {}
): Promise<T> => {

    const url = `${API_BASE_URL}${endpoint}`;
    const token = getToken();

    const config: RequestInit = {
        ...options,
        headers: {
            ...options.headers,
            // Only set JSON header if not blob
            ...(options.responseType !== "blob" && {
                "Content-Type": "application/json",
            }),
            ...(token && { Authorization: `Bearer ${token}` }),
        }
    };

    const response = await fetch(url, config);

    if (!response.ok) {
        let errData = null;
        try { errData = await response.json(); } catch { }
        throw new ApiError(errData?.message || "Request failed", response.status, errData);
    }

    if (options.responseType === "blob") {
        return response.blob() as Promise<any>;
    }

    return response.json();
};


// Auth API
export const authApi = {
    // Login
    async login(payload: User): Promise<ApiResponse> {
        const res = await apiRequest<ApiResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
        const data = res.data;
        if (data?.token) {
            setToken(data?.token);
        }
        return res;
    },

    // Register
    async register(payload: User): Promise<ApiResponse> {
        const res = await apiRequest<ApiResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
        const data = res.data;
        if (data.token) {
            setToken(data.token);
        }

        return res;
    },

    // Get current user profile
    async getProfile(): Promise<ApiResponse> {
        return await apiRequest<ApiResponse>('/auth/profile');
    },

    // Update profile
    async updateProfile(profileData: Record<string, any>): Promise<ApiResponse> {
        return await apiRequest<ApiResponse>('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData),
        });
    },

    // Update instructor profile
    async updateInstructorProfile(instructorData: Record<string, any>): Promise<ApiResponse> {
        return await apiRequest<ApiResponse>('/auth/instructor-profile', {
            method: 'PUT',
            body: JSON.stringify(instructorData),
        });
    },

    // Logout
    logout(): void {
        removeToken();
        if (typeof window !== 'undefined') {
            localStorage.removeItem('aiq-user');
        }
    },
};

// City API
export const citiesApi = {
    //  Get all cities (public endpoint)
    async getAll(params: Record<string, any> = {}): Promise<ApiResponse> {
        const queryParams = new URLSearchParams();

        Object.keys(params).forEach((key) => {
            if (params[key] !== undefined && params[key] !== null) {
                queryParams.append(key, params[key].toString());
            }
        });

        return await apiRequest<ApiResponse>(`/city?${queryParams}`);
    },

    //  Get single city by ID
    async getById(id: string): Promise<ApiResponse> {
        return await apiRequest<ApiResponse>(`/city/${id}`);
    },

    //  Create new city (Admin only)
    async create(data: { name: string; state: string; country?: string }): Promise<ApiResponse> {
        const token = getToken();
        return await apiRequest<ApiResponse>("/city", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
    },

    // Update existing city
    async update(
        id: string,
        data: { name?: string; state?: string; country?: string; isActive?: boolean }
    ): Promise<ApiResponse> {
        const token = getToken();

        return await apiRequest<ApiResponse>(`/city/${id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
    },

    // Delete city
    async delete(id: string): Promise<ApiResponse> {
        const token = getToken();

        return await apiRequest<ApiResponse>(`/city/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },
};

// theater
export const theatersApi = {
    //  Get all theaters (public)
    async getAll(params: Record<string, any> = {}): Promise<ApiResponse> {
        const queryParams = new URLSearchParams();

        Object.keys(params).forEach((key) => {
            if (params[key] !== undefined && params[key] !== null) {
                queryParams.append(key, params[key].toString());
            }
        });

        return await apiRequest<ApiResponse>(`/theaters?${queryParams}`);
    },

    //  Get a theater by ID
    async getById(id: string): Promise<ApiResponse> {
        return await apiRequest<ApiResponse>(`/theaters/${id}`);
    },

    //  Create a new theater (admin only)
    async create(theaterData: Record<string, any>): Promise<ApiResponse> {
        const token = getToken();

        return await apiRequest<ApiResponse>("/theaters", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(theaterData),
        });
    },

    //  Update theater (admin only)
    async update(id: string, updateData: Record<string, any>): Promise<ApiResponse> {
        const token = getToken();

        return await apiRequest<ApiResponse>(`/theaters/${id}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updateData),
        });
    },

    //  Delete theater (admin only)
    async delete(id: string): Promise<ApiResponse> {
        const token = getToken();

        return await apiRequest<ApiResponse>(`/theaters/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
    },
};

// shows
export const showsApi = {
    //  Get all shows (public)
    async getAll(params: Record<string, any> = {}): Promise<ApiResponse> {
        const queryParams = new URLSearchParams();

        Object.keys(params).forEach((key) => {
            if (params[key] !== undefined && params[key] !== null) {
                queryParams.append(key, params[key].toString());
            }
        });

        return await apiRequest<ApiResponse>(`/shows?${queryParams}`);
    },

    //  Get show by ID
    async getById(id: string): Promise<ApiResponse> {
        return await apiRequest<ApiResponse>(`/shows/${id}`);
    },

    //  Create new show (admin only)
    async create(showData: Record<string, any>): Promise<ApiResponse> {
        const token = getToken();

        return await apiRequest<ApiResponse>("/shows", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(showData),
        });
    },

    //  Update show (admin only)
    async update(id: string, updateData: Record<string, any>): Promise<ApiResponse> {
        const token = getToken();

        return await apiRequest<ApiResponse>(`/shows/${id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updateData),
        });
    },

    //  Delete show (admin only)
    async delete(id: string): Promise<ApiResponse> {
        const token = getToken();

        return await apiRequest<ApiResponse>(`/shows/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },
};

//  movie APi
export const concertApi = {
    //  Get all concerts (public)
    async getAll(params: Record<string, any> = {}): Promise<ApiResponse> {
        const queryParams = new URLSearchParams();

        Object.keys(params).forEach((key) => {
            if (params[key] !== undefined && params[key] !== null) {
                queryParams.append(key, params[key].toString());
            }
        });

        return await apiRequest<ApiResponse>(`/movies?${queryParams}`);
    },

    //  Get concert by ID (public)
    async getById(id: string): Promise<ApiResponse> {
        return await apiRequest<ApiResponse>(`/movies/${id}`);
    },

    //  Create new concert (admin only)
    async create(concertData: Record<string, any>): Promise<ApiResponse> {
        const token = getToken();

        return await apiRequest<ApiResponse>("/movies", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(concertData),
        });
    },

    //  Update concert details (admin only)
    async update(id: string, updateData: Record<string, any>): Promise<ApiResponse> {
        const token = getToken();

        return await apiRequest<ApiResponse>(`/movies/${id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updateData),
        });
    },

    //  Delete concert (admin only)
    async delete(id: string): Promise<ApiResponse> {
        const token = getToken();

        return await apiRequest<ApiResponse>(`/movies/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
    },
};


export const concertsApi = {
    // 1. Get all concerts (Public)
    async getAll(params: Record<string, any> = {}): Promise<ApiResponse> {
        const queryParams = new URLSearchParams();

        Object.keys(params).forEach((key) => {
            if (params[key] !== undefined && params[key] !== null) {
                queryParams.append(key, params[key].toString());
            }
        });

        return await apiRequest<ApiResponse>(`/concert?${queryParams.toString()}`);
    },

    // 2. Get concert by ID (Public)
    async getById(id: string): Promise<ApiResponse> {
        return await apiRequest<ApiResponse>(`/concert/${id}`);
    },

    // 3. Create new concert (Admin Only)
    async create(concertData: IConcertData | FormData): Promise<ApiResponse> {
        const token = getToken();

        const isFormData = concertData instanceof FormData;

        // If it's FormData (contains files), don't set Content-Type manually
        const headers: Record<string, string> = {
            Authorization: `Bearer ${token}`,
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
        };

        return await apiRequest<ApiResponse>("/concert", {
            method: "POST",
            headers,
            // Send FormData directly if it contains files, else JSON.stringify
            body: isFormData ? concertData : JSON.stringify(concertData),
        });
    },



    // 4. Update concert (Admin Only)
    async update(id: string, updateData: Partial<IConcertData> | FormData): Promise<ApiResponse> {
        const token = getToken();

        const isFormData = updateData instanceof FormData;

        return await apiRequest<ApiResponse>(`/concert/${id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                ...(isFormData ? {} : { "Content-Type": "application/json" }),
            },
            body: isFormData ? updateData : JSON.stringify(updateData),
        });
    },

    // 5. Delete concert (Admin Only)
    async delete(id: string): Promise<ApiResponse> {
        const token = getToken();

        return await apiRequest<ApiResponse>(`/concert/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },
};


export const userApi = {

    async getProfile(): Promise<ApiResponse<IUser>> {
        const token = getToken();
        return await apiRequest<ApiResponse<IUser>>("/profile", {
            method: "GET",
        });
    },

    async updateProfile(updateData: IUpdateProfileData): Promise<ApiResponse<IUser>> {
        const token = getToken();
        return await apiRequest<ApiResponse<IUser>>("/profile", {
            method: "PUT",
            body: JSON.stringify(updateData),
        });
    },

    async updatePassword(passwordData: IUpdatePasswordData): Promise<ApiResponse> {
        const token = getToken();
        return await apiRequest<ApiResponse>("/profile/password", {
            method: "PUT",
            body: JSON.stringify(passwordData),
        });
    },

    async getAllUsers(params: IGetAllUsersParams = {}): Promise<ApiResponse> {
        const token = getToken();
        const queryParams = new URLSearchParams();

        Object.keys(params).forEach((key) => {
            if (params[key as keyof IGetAllUsersParams] !== undefined && params[key as keyof IGetAllUsersParams] !== null) {
                queryParams.append(key, params[key as keyof IGetAllUsersParams]!.toString());
            }
        });

        return await apiRequest<ApiResponse>(`/users?${queryParams}`, {
            method: "GET",
        });
    },

    async updateUserByAdmin(
        userId: string,
        updateData: IAdminUpdateUserData
    ): Promise<ApiResponse<IUser>> {
        const token = getToken();
        return await apiRequest<ApiResponse<IUser>>(`/users/${userId}`, {
            method: "PUT",
            body: JSON.stringify(updateData),
        });
    },

    async resetUserPassword(
        userId: string,
        passwordData: IResetPasswordData
    ): Promise<ApiResponse> {
        const token = getToken();
        return await apiRequest<ApiResponse>(`/users/${userId}/password`, {
            method: "PUT",
            body: JSON.stringify(passwordData),
        });
    },

    async deleteUser(userId: string): Promise<ApiResponse> {
        const token = getToken();
        return await apiRequest<ApiResponse>(`/users/${userId}`, {
            method: "DELETE",
        });
    },
};





// ---------------------
// Seat API
// ---------------------
export const seatApi = {
    // Get all seats for a concert
    async getSeatsByConcert(concertId: string): Promise<ApiResponse<ISeat[]>> {
        console.log(concertId);
        return await apiRequest<ApiResponse>(`/seats/concert/${concertId}`);
    },

    // Create seats for a concert (admin)
    async createSeats(concertId: string, seats: ISeatCreatePayload[]): Promise<ApiResponse> {
        return await apiRequest<ApiResponse>(`/seats/concert/${concertId}`, {
            method: "POST",
            body: JSON.stringify({ seats }),
        });
    },

    // Lock seats for a user
    async lockSeats(payload: ISeatLockPayload): Promise<ApiResponse> {
        return await apiRequest<ApiResponse>(`/seats/lock`, {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },

    // Unlock seats (user cancels or time expires)
    async unlockSeats(payload: ISeatUnlockPayload): Promise<ApiResponse> {
        return await apiRequest<ApiResponse>(`/seats/unlock`, {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },
};




export const bookingApi = {
    // Get all bookings of the logged-in user
    async getUserBookings(): Promise<ApiResponse<IBooking[]>> {
        return await apiRequest<ApiResponse<IBooking[]>>(`/bookings`);
    },
    async getUserLatestBookings(): Promise<ApiResponse<IBooking>> {
        return await apiRequest<ApiResponse<IBooking>>(`/bookings/lastest`);
    },
    async getBookingByIdDownload(bookingId: string): Promise<ApiResponse> {
        return await apiRequest<ApiResponse>(`/bookings/download/${bookingId}`, {
            method: "POST",
            responseType: "blob",
        });
    },

    // Get booking details by ID
    async getBookingById(bookingId: string): Promise<ApiResponse<IBooking>> {
        return await apiRequest<ApiResponse<IBooking>>(`/bookings/${bookingId}`);
    },

    // Cancel a booking by ID
    async cancelBooking(bookingId: string): Promise<ApiResponse> {
        return await apiRequest<ApiResponse>(`/bookings/${bookingId}/cancel`, {
            method: "POST",
        });
    },
};




// export const paymentApi = {
//     // Initiate payment
//     async initiatePayment(payload: IPaymentInitiatePayload): Promise<ApiResponse> {
//         return await apiRequest<ApiResponse>(`/payment/initiate`, {
//             method: "POST",
//             body: JSON.stringify(payload),
//         });
//     },

//     async initiatePayment(payload: IPaymentInitiatePayload): Promise<ApiResponse> {
//         return await apiRequest<ApiResponse>(`/payment/initiate`, {
//             method: "POST",
//             body: JSON.stringify(payload),
//         });
//     },

//     // Verify payment
//     async verifyPayment(payload: IPaymentVerifyPayload): Promise<ApiResponse> {
//         return await apiRequest<ApiResponse>(`/payment/verify`, {
//             method: "POST",
//             body: JSON.stringify(payload),
//         });
//     },

//     // Refund payment
//     async refundPayment(payload: IPaymentRefundPayload): Promise<ApiResponse> {
//         return await apiRequest<ApiResponse>(`/payment/refund`, {
//             method: "POST",
//             body: JSON.stringify(payload),
//         });
//     },


// };

export const StripeApi = {
    async initiatePayment(payload: IStripePaymentInitiatePayload): Promise<ApiStripeResponse> {
        return await apiRequest<ApiStripeResponse>("/stripe", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },
};
















// Export helper functions
export { ApiError, getToken, setToken, removeToken };