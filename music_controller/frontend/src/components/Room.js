import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
    Typography,
    Card,
    CardContent,
    CardHeader,
    CardMedia,
    Box,
    Divider,
    Chip
} from '@mui/material';

export default function Room() {
    const [date, setDate] = useState(new Date());

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

    const imageRandomizer = () => {
        var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return `https://picsum.photos/seed/${retVal}/200/300`;
    }

    useEffect(() => {
        handleGetRoom();
    }, [roomCode]);

    return (
        <Card className='p-4 rounded-lg shadow-lg transition-shadow hover:shadow-2xl' onClick={imageRandomizer}>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 4 }}>
                <CardContent sx={{ padding: '0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <CardHeader
                        title={roomCode}
                        subheader={date.toDateString()}
                        sx={{ padding: '0' }}
                    />
                    <Divider />
                    <CardContent 
                        sx={{ padding: '0' }}
                    >
                        <Typography variant="body2" color="text.secondary">
                            Votes: <Chip color="primary" label={votesToSkip} size="small" />
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Guest Can Pause: <Chip color="primary" label={guestCanPause.toString()} size="small" />
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Host: <Chip color="primary" label={guestCanPause.toString()} size="small" />
                        </Typography>
                    </CardContent>
                </CardContent>
                <CardMedia
                    component="img"
                    sx={{ width: 200, height: 200, borderRadius: 1 }}
                    image={imageRandomizer()}
                    alt="Image placeholder"
                />
            </Box>
        </Card>
    )
}