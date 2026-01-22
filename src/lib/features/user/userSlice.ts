import { User } from "@/interfaces/loginInterface";
import { apiRequest } from "@/lib/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";


interface UserState {
    user: User | null;
    error: string | null;
    loading: boolean;
}

const initialState: UserState = {
    user: null,
    error: null,
    loading: false,
};

export const fetchUserProfile = createAsyncThunk(
    "user/fetchUserProfile",
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiRequest({
                method: "get",
                url: "/users/profile",
            });
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data || "Failed to fetch user profile");
        }
})

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        clearUserState: (state) => {
            state.user = null;
            state.error = null;
            state.loading = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.user = action.payload;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            });
        },
});


export const { clearUserState } = userSlice.actions;
export default userSlice.reducer;