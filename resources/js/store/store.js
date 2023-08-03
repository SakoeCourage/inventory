import { configureStore } from '@reduxjs/toolkit'
import { authSlice } from './authSlice'
import { unreadcountSlice } from './unreadCountSlice'

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        unreadCount: unreadcountSlice.reducer
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        })
})

window.store = store