import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { clearUnreadCount } from "../store/unreadCountSlice";
import User from '../api/User'
import Cookies from 'js-cookie';

const initialState = {
    auth: null,
    loadingState: 'idle',
}

function removePreloader(){
    document.querySelector('.pagepreloader').style.display = 'none';
} 

export const getUser = createAsyncThunk('/user', async () => {
    try {
        const user = await User.auth()
        console.log(user.data)

        return user
    } catch (error) {
        return error.message
    }
})

export const Logout = createAsyncThunk('/logout', async () => {
    try {
        const req = await User.logout()
        Cookies.remove('BearerToken')
        window.store.dispatch(clearUnreadCount())
        return req
    } catch (error) {
        console.log(error)
        return error.message
    }

})

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearCredentials: (state) => {
            state.auth = null
        }
    },
    extraReducers(builder) {
        builder.addCase(getUser.pending, (state, action) => {
            state.loadingState = 'pending'
        })
            .addCase(getUser.fulfilled, (state, action) => {
                state.auth = action.payload?.data ?? null
                state.loadingState = 'success'
                removePreloader()
            })
            .addCase(getUser.rejected, (state, action) => {
                state.loadingState = 'failed'
                console.log(action.error.message)
            })
        builder.addCase(Logout.fulfilled, (state, action) => {
            state.auth = null
        })
    }
})

export const { clearCredentials } = authSlice.actions
export const getAuth = (state) => state.auth
export const loadingState = (state) => state.loadingState
