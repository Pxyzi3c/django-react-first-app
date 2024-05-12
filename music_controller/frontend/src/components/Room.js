import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function Room() {
    const [votesToSkip, setVotesToSkip] = useState(2);
    const [guestCanPause, setGuestCanPause] = useState(false);
    const [isHost, setIsHost] = useState(false);

    const { roomCode } = useParams();

    const handleGetRoom = async () => {
        try {
            const response = await axios.get("/api/get-room" + "?code=" + roomCode);
            
            setVotesToSkip(response.data.votes_to_skip)
            setGuestCanPause(response.data.guest_can_pause)
            setIsHost(response.data.is_host)
            console.log(response.data);
        } catch (error) {
            console.log("Error fetching room:", error);
        }
    }

    useEffect(() => {
        handleGetRoom();
    }, [roomCode]);

    return (
        <div>
            <h3>Room Code: {roomCode}</h3>
            <p>Votes: {votesToSkip}</p>
            <p>Guest Can Pause: {guestCanPause.toString()}</p>
            <p>Host: {isHost.toString()}</p>
        </div>
    )
}