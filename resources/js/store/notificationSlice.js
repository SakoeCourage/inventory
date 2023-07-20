import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import Api from '../api/Api'


const initialState = {
    expenseCount: null,
    loadingState: 'idle',
}


export const getPendingExpenseCount = createAsyncThunk('/expense/pending-count', async () => {
    try {
        const res = await Api.get('/expense/pending-count')
        console.log(res)
        return res
    } catch (error) {
        return error.message
    }

})




export const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        clearCredentials: (state) => {
           state = initialState
        }
    },
    extraReducers(builder) {
        builder.addCase(getPendingExpenseCount.pending, (state, action) => {
            state.loadingState = 'pending'
        })
            .addCase(getPendingExpenseCount.fulfilled, (state, action) => {
                state.expenseCount = action.payload?.data ?? null
                state.loadingState = 'success'
            })
            .addCase(getPendingExpenseCount.rejected, (state, action) => {
                state.loadingState = 'failed'
                console.log(action.error.message)
            })
    }
})


export const getPendingCount = (state) => state.expenseCount
