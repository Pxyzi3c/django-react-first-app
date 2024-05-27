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
    Collapse,
    Alert
} from '@mui/material';
export default function CreateRoomPage({
    votesToSkip = 2,
    guestCanPause = true,
    update = false,
    roomCode = null,
    closeButton = null,
    updateCallback = () => {}
}) {
    const navigate = useNavigate();

    const [successMsg, setSuccessMsg] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    const setTitle = () => {
        return update ? "Update Room" : "Create a Room"
    }

    const setDefaultVotes = () => {
        return votesToSkip === 2 ? 2 : votesToSkip
    }

    const setBackOrCloseBtn = () => {
        if (closeButton) {
            return closeButton;
        } else {
            const backButton = (
                <Button color='secondary' variant='contained' className='w-100' to="/" component={Link}>
                    Back
                </Button>
            );
            return backButton;
        }
    };

    const handleVotesChange = (e) => {
        votesToSkip = e.target.value;
    }

    const handleGuestCanPauseChange = (e) => {
        guestCanPause = e.target.value === "true" ? true : false
    }

    const handleRoomButtonPressed = async () => {
        return update ? await updateRoom() : await createRoom();
    };

    const createRoom = async () => {
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

    const updateRoom = async () => {
        try {
            const response = await axios.patch("/api/update-room", {
                votes_to_skip: votesToSkip,
                guest_can_pause: guestCanPause,
                code: roomCode
            });

            if (response.status == 200) {
                setSuccessMsg("Room updated successfully!")
                console.log(successMsg)
            } else {
                setSuccessMsg("Error updating room!")
                console.log("Error updating room:", error); 
            }
        } catch (error) {
            setSuccessMsg("Error updating room!")
            console.log("Error updating room:", error);
        }
        updateCallback()
    }

    return (
        <div className='flex justify-center'>
            <Grid container spacing={1} sm={6} md={4} className='p-4 rounded-lg shadow-lg transition-shadow hover:shadow-2xl'>
                <Grid item xs={12} align="center">
                    <Collapse 
                        in={errorMsg != null || successMsg != null}
                    >
                        {successMsg != null ? (
                            <Alert
                                severity='success'
                                onClose={() => {
                                    setSuccessMsg(null)
                                }}
                            >
                                {successMsg}
                            </Alert>
                        ) : (
                            <Alert
                                severity='error'
                                onClose={() => {
                                    setErrorMsg(null)
                                }}
                            >
                                {errorMsg}
                            </Alert>
                        )}
                    </Collapse>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography component="h4" variant="h4">
                        {setTitle()}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <FormControl component="fieldset">
                        <FormHelperText>
                            <div align="center">Guest Control of Playback State</div>
                        </FormHelperText>
                        <RadioGroup 
                            row 
                            defaultValue={guestCanPause}
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
                            defaultValue={setDefaultVotes()}
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
                        className='w-100'
                        onClick={handleRoomButtonPressed}
                    >
                        {setTitle()}
                    </Button>
                </Grid>
                <Grid item xs={12} align="center">
                    {setBackOrCloseBtn()}
                </Grid>
            </Grid>
        </div>
    )
}