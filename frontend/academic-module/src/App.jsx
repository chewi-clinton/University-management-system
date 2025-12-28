import React from "react";
import StudentRoutes from "./routes/StudentRoutes";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        <StudentRoutes />
      </div>
    </AuthProvider>
  );
}

export default App;
