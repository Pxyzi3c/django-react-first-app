import React from 'react';
import { 
    BrowserRouter as Router, 
    Route,
    Routes, 
    Redirect 
} from "react-router-dom";
import RoomJoinPage from './RoomJoinPage';
import CreateRoomPage from './CreateRoomPage';
 
export default function HomePage() {
    return (
        <>  
            <Router>
                <Routes>
                    <Route index element={<h1>Welcome to the league of Harvy!</h1>} />
                    <Route path="join" element={<RoomJoinPage />} />
                    <Route path="create" element={<CreateRoomPage />} />
                </Routes>
            </Router>
        </> 
    )
}