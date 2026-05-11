import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    name: '',
    email: '',
    telephone: '',
    organization: '',
    token: null,
    id: null,
    isLoggedIn: false,
    isAdmin: false,
    selectedUser: null,
    searchQuery: '',
    avatar: '',
    ticketStatus: 'all',
    hasNewTickets: false,  // Track the selected ticket filter
  },
  
  reducers: {
    login: (state, action) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.avatar = action.payload.avatar;
      state.telephone = action.payload.telephone;
      state.organization = action.payload.organization;
      state.token = action.payload.token;
      state.id = action.payload.id;
      state.isAdmin = action.payload.isAdmin;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.name = '';
      state.email = '';
      state.telephone = '';
      state.organization = '';
      state.token = null;
      state.id = null;
      state.isAdmin = false;
      state.isLoggedIn = false;
      state.avatar = '';
      state.ticketStatus = 'all'; // Reset ticket status when logging out
    },
    updateUserDetails: (state, action) => {
      if (action.payload.name) state.name = action.payload.name;
      if (action.payload.email) state.email = action.payload.email;
      if (action.payload.avatar) state.avatar = action.payload.avatar;
      if (action.payload.telephone) state.telephone = action.payload.telephone;
      if (action.payload.organization) state.organization = action.payload.organization;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setTicketStatus: (state, action) => {
      state.ticketStatus = action.payload;
    },
    setHasNewTickets: (state, action) => {
      state.hasNewTickets = action.payload; // Update the notification status
    },
  },
});

export const {
  login,
  logout,
  updateUserDetails,
  setSelectedUser,
  clearSelectedUser,
  setSearchQuery,
  setTicketStatus,
  setHasNewTickets,
} = userSlice.actions;

export default userSlice.reducer;
