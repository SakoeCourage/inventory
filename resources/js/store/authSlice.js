import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import User from '../api/User'

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
        return user
    } catch (error) {
        error && console.log(error)
        return error.message
    }
})

export const Logout = createAsyncThunk('/logout', async () => {
    try {
        const user = await User.logout()
        return user
    } catch (error) {
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
