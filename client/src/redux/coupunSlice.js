import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Backend API URL
const API_URL = "http://localhost:5000/api/coupons";
const CLAIMED_COUPONS_URL = "http://localhost:5000/api/user-coupons/claimedcoupuns"; // New endpoint

// Fetch Coupons from Backend
export const fetchCoupons = createAsyncThunk("coupon/fetchCoupons", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      withCredentials: true, // Include cookies
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to fetch coupons");
  }
});

// Create a New Coupon (Admin Only)
export const addCoupon = createAsyncThunk("coupon/addCoupon", async (couponData, { rejectWithValue }) => {
  try {
    const response = await axios.post(API_URL, couponData, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to add coupon");
  }
});

// Toggle Coupon Status
export const toggleCoupon = createAsyncThunk("coupon/toggleCoupon", async (id, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${API_URL}/${id}/toggle`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to toggle coupon");
  }
});

// Delete a Coupon
export const deleteCoupon = createAsyncThunk("coupon/deleteCoupon", async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      withCredentials: true,
    });
    return id; // Return deleted coupon ID
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to delete coupon");
  }
});

// Claim a Coupon (User Side)
export const claimCoupon = createAsyncThunk("coupon/claimCoupon", async ({ couponId, sessionId }, { rejectWithValue }) => {
  try {
    const response = await axios.post("http://localhost:5000/api/user-coupons/claim", { couponId, sessionId }, {
      withCredentials: true, // Send cookies for session tracking
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to claim coupon");
  }
});

// Fetch claimed coupons
export const fetchClaimedCoupons = createAsyncThunk("coupon/fetchClaimedCoupons", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(CLAIMED_COUPONS_URL, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      withCredentials: true, // Include cookies to identify user
    });
    return response.data.claimedCoupons; // Extract claimedCoupons array
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to fetch claimed coupons");
  }
});

// Redux Slice
const couponSlice = createSlice({
  name: "coupon",
  initialState: {
    coupons: [],
    claimedCoupons:[],
    shouldRefetch: false, // Add a refetch flag
    loading: false,
    error: null,
    successMessage: "",
  },
  reducers: {
    triggerRefetch: (state) => {
      return {
        ...state, // Create a new state object
        shouldRefetch: true,
        successMessage: "",
        error: null,
      };
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoupons.pending, (state) => {
        return {
          ...state,
          loading: true,
          error: null,
        };
      })
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        return {
          ...state,
          loading: false,
          coupons: action.payload.map(coupon => ({
            ...coupon,
            claimed: coupon.claimedBy.length > 0,
          })),
          shouldRefetch: false, // Reset refetch flag after successful fetch
          error: null,
        };
      })
      .addCase(fetchCoupons.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      })
      .addCase(addCoupon.fulfilled, (state, action) => {
        return {
          ...state,
          coupons: [...state.coupons, action.payload],
          shouldRefetch: true,
          successMessage: "Coupon added successfully!",
        };
      })
      .addCase(toggleCoupon.fulfilled, (state, action) => {
        return {
          ...state,
          coupons: state.coupons.map((c) =>
            c._id === action.payload._id ? { ...c, active: action.payload.active } : c
          ),
        };
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        return {
          ...state,
          coupons: state.coupons.filter((c) => c._id !== action.payload),
        };
      })
      .addCase(claimCoupon.fulfilled, (state, action) => {
        const claimedCouponIndex = state.coupons.findIndex((c) => c._id === action.payload.coupon._id);

        return {
          ...state,
          successMessage: action.payload.message,
          coupons: claimedCouponIndex !== -1
            ? state.coupons.map((c) =>
              c._id === action.payload.coupon._id
                ? {
                  ...c,
                  claimedBy: action.payload.coupon.claimedBy,
                  claimed: true,
                }
                : c
            )
            : state.coupons,
        };
      })
      .addCase(claimCoupon.rejected, (state, action) => {
        return {
          ...state,
          error: action.payload,
          successMessage: "",
        };
      })
      .addCase(fetchClaimedCoupons.pending, (state) => {
        return {
          ...state,
          loading: true,
          error: null,
        };
      })
      .addCase(fetchClaimedCoupons.fulfilled, (state, action) => {
        return {
          ...state,
          loading: false,
          claimedCoupons: action.payload,
          error: null,
        };
      })
      .addCase(fetchClaimedCoupons.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      });
  },
});

export const { triggerRefetch, setError } = couponSlice.actions;
export default couponSlice.reducer;
