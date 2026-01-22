import { createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface AuthState {
    user: null;
    error: null | string;
    loading: boolean;
    access_token: null;
    refresh_token?: null | string;
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
}

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

export const logoutAdmin = createAsyncThunk('auth/logout', async() => {
   try {
    const response = await axios.post(`${API_URL}/users/logout`)
   } catch (error) {
    if (error instanceof AxiosError) {
        console.log("Logout error:", error.response?.data?.message || "Something went wrong during logout");
      }
      return 
   }
})

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        testActions: () => {
         console.log('test')
        },
        logout: (state) => {
            state.access_token = null
            state.refresh_token = null
            state.user = null
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(login.pending, (state) => {
            state.loading = true
        })
        .addCase(login.fulfilled, (state, action) => {
            console.log("action.payload", action.payload)
            state.user = action.payload.data.user
            state.access_token = action.payload.data.access_token
            state.refresh_token = action.payload.data.refresh_token
            state.loading = false
            state.error=null
        })
        .addCase(login.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as string
        })
    }
})

export const { testActions, logout } = authSlice.actions;
export default authSlice.reducer;