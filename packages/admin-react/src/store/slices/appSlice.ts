import { createSlice } from '@reduxjs/toolkit'

const appSlice = createSlice({
  name: 'app',
  initialState: {
    collapsed: false,
  },
  reducers: {
    toggleCollapsed(state) {
      state.collapsed = !state.collapsed
    },
    setCollapsed(state, action) {
      state.collapsed = action.payload
    },
  },
})

export const { toggleCollapsed, setCollapsed } = appSlice.actions
export default appSlice.reducer
