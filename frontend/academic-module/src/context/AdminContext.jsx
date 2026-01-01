import { createContext, useContext, useReducer } from 'react';

const AdminContext = createContext();

const initialState = {
  filters: {},
  selectedItems: [],
  bulkAction: null,
  viewMode: 'table', // table | grid | kanban
  sortBy: null,
  sortOrder: 'asc'
};

function adminReducer(state, action) {
  switch (action.type) {
    case 'SET_FILTERS':
      return { ...state, filters: action.payload };
    case 'SELECT_ITEMS':
      return { ...state, selectedItems: action.payload };
    case 'SET_BULK_ACTION':
      return { ...state, bulkAction: action.payload };
    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload };
    case 'SET_SORT':
      return { 
        ...state, 
        sortBy: action.payload.by, 
        sortOrder: action.payload.order 
      };
    case 'CLEAR_SELECTION':
      return { ...state, selectedItems: [], bulkAction: null };
    default:
      return state;
  }
}

export function AdminProvider({ children }) {
  const [state, dispatch] = useReducer(adminReducer, initialState);

  return (
    <AdminContext.Provider value={{ state, dispatch }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
}