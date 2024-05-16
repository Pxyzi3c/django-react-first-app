import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Button,
    Grid,
    Typography,
    TextField,
    FormHelperText,
    FormControl,
    Radio,
    RadioGroup,
    FormControlLabel,
} from '@mui/material';

export default function CreateRoomPage() {
    const navigate = useNavigate();

    const [defaultVotes, setDefaultVotes] = useState(2)
    const [guestCanPause, setGuestCanPause] = useState(true);
    const [votesToSkip, setVotesToSkip] = useState(defaultVotes);

    const handleVotesChange = (e) => {
        setVotesToSkip(e.target.value);
    }

    const handleGuestCanPauseChange = (e) => {
        setGuestCanPause(e.target.value === "true" ? true : false)
    }

    const handleRoomButtonPressed = async () => {
        try {
            const response = await axios.post("/api/create-room", {
                votes_to_skip: votesToSkip,
                guest_can_pause: guestCanPause
            });

            if (response.data && response.data.code) {
                navigate(`/room/${response.data.code}`);
            } else {
                console.log("Error creating room:", error); 
            }
        } catch (error) {
            console.log("Error creating room:", error);
        }
    }

    return (
        <div className='flex justify-center'>
            <Grid container spacing={1} sm={6} md={4} className='p-4 rounded-lg shadow-lg transition-shadow hover:shadow-2xl'>
                <Grid item xs={12} align="center">
                    <Typography component="h4" variant="h4">
                        Create A Room
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <FormControl component="fieldset">
                        <FormHelperText>
                            <div align="center">Guest Control of Playback State</div>
                        </FormHelperText>
                        <RadioGroup 
                            row 
                            defaultValue="true"
                            onChange={handleGuestCanPauseChange}
                        >
                            <FormControlLabel  
                                value="true" 
                                control={<Radio color="primary" />}
                                label="Play/Pause"
                                labelPlacement="bottom"
                            />
                            <FormControlLabel 
                                value="false" 
                                control={<Radio color="secondary" />}
                                label="No Control"
                                labelPlacement="bottom"
                            />
                        </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid item xs={12} align="center">
                    <FormControl>
                        <TextField
                            required={true}
                            type='number'
                            defaultValue={defaultVotes}
                            inputProps={{
                                min: 1,
                                style: { textAlign: "center" },
                            }}
                            onChange={handleVotesChange}
                        />
                        <FormHelperText>
                            <div align="center">Votes Required To Skip Song</div>
                        </FormHelperText>
                    </FormControl>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button 
                        color='primary' 
                        variant='contained'
                        onClick={handleRoomButtonPressed}
                    >
                        Create A Room
                    </Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color='secondary' variant='contained' to="/" component={Link}>
                        Back
                    </Button>
                </Grid>
            </Grid>
        </div>
    )
}