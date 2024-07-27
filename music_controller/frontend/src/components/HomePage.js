import React, { useState, useEffect } from 'react';
import RoomJoinPage from './RoomJoinPage';
import CreateRoomPage from './CreateRoomPage';
import Room from './Room';
import { 
    BrowserRouter as Router, 
    Route,
    Routes,
    Link,
    Navigate
} from "react-router-dom";
import {
    Button,
    Grid,
    Typography,
    ButtonGroup,
} from '@mui/material';
import Info from './Info';
import axios from 'axios';

export default function HomePage() {
    const [roomCode, setRoomCode] = useState(null);

    const getData = async () => {
        try {
            const response = await axios.get("/api/user-in-room")

            setRoomCode(response.data.code)
        } catch (error) {
            console.log(error)
        }
    }

    const renderHomePage = () => {
        return (
            <Grid container spacing={3}>
                <Grid item xs={12} align="center">
                    <Typography variant='h3' compact='h3'>
                        House Party
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <ButtonGroup disableElevation variant="contained" color='primary'>
                        <Button color='primary' to='/join' component={Link}>
                            Join a Room
                        </Button>
                        <Button variant='outlined' to='/info' component={Link}>
                            Info
                        </Button>
                        <Button color='secondary' to='/create' component={Link}>
                            Create a Room
                        </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
        );
    }
    
    useEffect(() => {
        getData();
    })
    return (
        <Router>
            <Routes>
                {roomCode ? (
                    <Route path="/" element={<Navigate to={`/room/${roomCode}`} />} />
                ) : (
                    <Route index element={renderHomePage()} />
                )}
                <Route path="join" element={<RoomJoinPage />} />
                <Route path='info' element={<Info />} />
                <Route path="create" element={<CreateRoomPage />} />
                <Route path="room/:roomCode" element={<Room />} />
            </Routes>
        </Router>
    )
}