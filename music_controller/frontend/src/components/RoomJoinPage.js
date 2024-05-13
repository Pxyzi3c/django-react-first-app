import React from 'react';
import {
    TextField,
    Button,
    Grid,
    Typography
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function RoomJoinPage() {
    const [roomCode, setRoomCode] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate();

    const handleTextFieldChange = (e) => {
        setRoomCode(e.target.value)
    }

    const handleEnterRoomPressed = async () => {
        if (!roomCode) {
            return setError("Please enter room code!")
        }

        try {
            const response = await axios.post("/api/join-room", {
                code: roomCode
            });

            if (response.status == 200 || response.status == 201) {
                navigate(`/room/${roomCode}`);
            } else {
                console.log("Error joining room:", response); 
                setError("Room not found.")
            }
        } catch (error) {
            console.log("Error joining room:", error);
            setError("Room not found.")
        }
    }

    useEffect(() => {
        if (roomCode) {
            setError("")
        } else {
            setError("Please enter room code!")
        }
    }, [roomCode])
    return (
        <>
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Typography variant="h4" component="h4">
                        Join a Room
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <TextField 
                        error={error}
                        label="Code"
                        placeholder="Enter a Room Code"
                        value={roomCode}
                        helperText={error}
                        variant="outlined"
                        onChange={handleTextFieldChange}
                    />
                </Grid>
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="primary" onClick={handleEnterRoomPressed}>
                        Enter Room
                    </Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="secondary" to="/" component={Link}>
                        Back
                    </Button>
                </Grid>
            </Grid>            
        </>       
    )
}