// src/lib/features/auth/authSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "../../axiosInstance";
import axios, { AxiosError } from "axios";
import { User } from "@/interfaces/loginInterface";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface AuthState {
  user: User | null;
  error: string | null;
  loading: boolean;
  access_token: string | null;
  refresh_token: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

const initialState: AuthState = {
  user: null,
  error: null,
  loading: false,
  access_token: null,
  refresh_token: null,
};

export const login = createAsyncThunk('auth/login', async(credentials: LoginCredentials, {rejectWithValue}) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, {emailOrPhone: credentials.email, password: credentials.password})
        console.log("response", response)
        if (response?.data && response.data?.data?.user?.role?.name !== "ADMIN") {
            return rejectWithValue({message:"You are not an admin"});
          }
          return response.data;
    } catch (error: unknown) {
        console.log("error",error)
        if (error instanceof AxiosError) {
            return rejectWithValue({message: error.response?.data?.message || "Something went wrong"});
          }
          return rejectWithValue({message:"Something went wrong"});
        }
})

export const logoutAdmin = createAsyncThunk(
  "auth/logoutAdmin",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await apiRequest({
        method: "post",
        url: "/users/logout",
      });

      // Optional: backend already invalidated token → we clear anyway
      dispatch(logout()); // clear redux
      return response;
    } catch (error: unknown) {
      // 401 will be caught by interceptor → no need to handle here again
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return;
        }
        return rejectWithValue(error.message || "Logout failed");
      }
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.access_token = null;
      state.refresh_token = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // login cases...
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.access_token = action.payload.data.access_token;
        state.refresh_token = action.payload.data.refresh_token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // logoutAdmin (manual logout)
      .addCase(logoutAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.loading = false;
        // already cleared by reducer in dispatch(logout())
      })
      .addCase(logoutAdmin.rejected, (state) => {
        state.loading = false;
        // 401 already handled by interceptor
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;