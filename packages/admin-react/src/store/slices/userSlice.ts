import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import request from '../../utils/request'

interface UserInfo {
  username: string
  role: string
}

interface UserState {
  token: string
  userInfo: UserInfo | null
}

export const login = createAsyncThunk(
  'user/login',
  async ({ username, password }: { username: string; password: string }) => {
    const result: any = await request.post('/auth/admin-login', { username, password })
    return result.token as string
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState: {
    token: localStorage.getItem('admin_token') || '',
    userInfo: null,
  } as UserState,
  reducers: {
    logout(state) {
      state.token = ''
      state.userInfo = null
      localStorage.removeItem('admin_token')
    },
  },
  extraReducers: builder => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.token = action.payload
      localStorage.setItem('admin_token', action.payload)
    })
  },
})

export const { logout } = userSlice.actions
export default userSlice.reducer
