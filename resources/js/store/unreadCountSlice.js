import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import Api from '../api/Api'


const initialState = {
    unreadCount: null,
    loadingState: 'idle',
}


export const getUnreadCount = createAsyncThunk('/unread-count/all', async () => {
    try {
        const res = await Api.get('/unread-count/all')
        return res
    } catch (error) {
        return error.message
    }

})


export const unreadcountSlice = createSlice({
    name: 'unreadCount',
    initialState,
    reducers: {
        clearUnreadCount: (state) => {
            state.unreadCount = null
        }
    },
    extraReducers(builder) {
        builder.addCase(getUnreadCount.pending, (state, action) => {
            state.loadingState = 'pending'
        })
            .addCase(getUnreadCount.fulfilled, (state, action) => {
                state.unreadCount = action.payload?.data ?? null
                state.loadingState = 'success'
            })
            .addCase(getUnreadCount.rejected, (state, action) => {
                state.loadingState = 'failed'
                console.log(action.error.message)
            })
    }
})

export const { clearUnreadCount } = unreadcountSlice.actions
export const getPendingCount = (state) => state.unreadCount

