import { createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface UserState {
    user: null;
    error: null | string;
    loading: boolean;
}

