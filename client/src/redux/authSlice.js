import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Base API URL
const API_URL = "http://localhost:5000/api/auth";

// Async Thunks
export const registerUser = createAsyncThunk("auth/register", async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const loginUser = createAsyncThunk("auth/login", async (credentials, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/login`, credentials, { withCredentials: true });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const logoutUser = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
    try {
        await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
        return null;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// Load user from localStorage
const initialState = {
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
    loading: false,
    error: null
};

// Auth Slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => { state.loading = true; })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(loginUser.pending, (state) => { state.loading = true; })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.error = null;

                // Save token to localStorage
                localStorage.setItem("token", action.payload.token);
                localStorage.setItem("user", JSON.stringify(action.payload.user));
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            });
    }
});

export default authSlice.reducer;
