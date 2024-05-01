import React from 'react';
import { 
    BrowserRouter as Router, 
    Route,
    Routes, 
    Link, 
    Redirect 
} from "react-router-dom";
import RoomJoinPage from './RoomJoinPage';
import CreateRoomPage from './CreateRoomPage';

export default function HomePage() {
    return (
        <>
            <Router>
                <Routes>
                    <Route index element={<h1>This is the homepage</h1>} />
                    <Route path="join" element={<RoomJoinPage />} />
                    <Route path="create" element={<CreateRoomPage />} />
                </Routes>
            </Router>
        </>
    )
}