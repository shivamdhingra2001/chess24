import React, { useState } from 'react';
import {
  Button, Modal, TextField, MenuItem, Box, Chip, Typography,
} from '@mui/material';
import { motion } from "framer-motion";
import MiniDrawer from '../Home/Minidrawer';

function Tournaments() {
  const [userName, setUserName] = useState('');
  const [open, setOpen] = useState(false);
  const [tournaments, setTournaments] = useState([
    {
      id: 1,
      name: 'City Chess Championship',
      date: '2023-09-15',
      endDate: '2023-09-17',
      location: 'New York',
      status: 'Upcoming',
      type: 'Singles',
      participants: 16,
      prizePool: '$5000',
      registrationDeadline: '2023-09-10',
      registeredUsers: [],
    },
    {
      id: 2,
      name: 'State Open Tournament',
      date: '2023-10-05',
      endDate: '2023-10-07',
      location: 'Los Angeles',
      status: 'Open for Registration',
      type: 'Doubles',
      participants: 32,
      prizePool: '$8000',
      registrationDeadline: '2023-10-01',
      registeredUsers: [],
    },
  ]);

  const [newTournament, setNewTournament] = useState({
    name: '',
    date: '',
    endDate: '',
    location: '',
    status: 'Upcoming',
    type: 'Singles',
    participants: '',
    prizePool: '',
    registrationDeadline: '',
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewTournament({
      name: '',
      date: '',
      endDate: '',
      location: '',
      status: 'Upcoming',
      type: 'Singles',
      participants: '',
      prizePool: '',
      registrationDeadline: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTournament((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTournament.name.trim()) return;

    const tournament = {
      ...newTournament,
      id: tournaments.length + 1,
      participants: parseInt(newTournament.participants),
      registeredUsers: [],
    };

    setTournaments((prev) => [...prev, tournament]);
    handleClose();
  };

  const registerUser = (tournamentId) => {
    if (!userName.trim()) return;

    setTournaments((prev) =>
      prev.map((tournament) =>
        tournament.id === tournamentId &&
        !tournament.registeredUsers.includes(userName)
          ? {
              ...tournament,
              registeredUsers: [...tournament.registeredUsers, userName],
            }
          : tournament
      )
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Upcoming':
        return 'warning';
      case 'Open for Registration':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-gray-900 to-blue-900 min-h-screen flex flex-row overflow-hidden">
      {/* Floating background shapes */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-700 opacity-30 rounded-full blur-3xl z-0 animate-pulse" />
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-blue-400 opacity-20 rounded-full blur-2xl z-0 animate-pulse" />
      <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-white opacity-10 rounded-full blur-2xl z-0 animate-pulse" />
      <MiniDrawer />
      <div className="flex flex-col items-start justify-start w-full px-6 py-8 md:px-20 md:py-20 mt-8 lg:mt-0 gap-8 z-10">
        <motion.div
          className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full mb-4 gap-4 sm:gap-0"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: 'spring', stiffness: 60 }}
        >
          <h1 className="text-4xl font-bold text-blue-100 drop-shadow">Tournaments</h1>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-400 to-blue-700 rounded-full ml-4 animate-pulse" />
          <div className="flex flex-col gap-2 w-full max-w-xs sm:flex-row sm:gap-2 sm:items-center sm:w-auto sm:max-w-none">
            <TextField
              label="Your Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              size="small"
              sx={{
                width: '100%',
                background: "#222e3a",
                borderRadius: 1,
                input: { color: "#fff" },
                label: { color: "#b3c2d6" }
              }}
              InputLabelProps={{ style: { color: "#b3c2d6" } }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpen}
              sx={{
                boxShadow: 3,
                background: "linear-gradient(90deg,#2563eb,#1e40af)",
                color: "#fff",
                width: '100%',
                minWidth: 0,
                '@media (min-width: 640px)': {
                  width: 'auto',
                  minWidth: 140
                }
              }}
            >
              Add Tournament
            </Button>
          </div>
        </motion.div>
        <motion.div
          className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 xs:gap-6 md:gap-8 w-full"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.12 }
            }
          }}
        >
          {tournaments.map((tournament, idx) => (
            <motion.div
              key={tournament.id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { delay: idx * 0.08, duration: 0.5 } }
              }}
              whileHover={{ scale: 1.04, boxShadow: "0 8px 32px 0 rgba(0, 123, 255, 0.18)" }}
            >
              <Box
                sx={{
                  borderRadius: 3,
                  boxShadow: 3,
                  bgcolor: "#1e293b",
                  color: "#e0e7ef",
                  p: { xs: 1.5, sm: 2, md: 3 },
                  display: "flex",
                  flexDirection: "column",
                  minHeight: { xs: 220, sm: 260, md: 340 },
                  maxWidth: { xs: 240, sm: 280, md: 360 },
                  width: '100%',
                  border: "1px solid #334155",
                  margin: '0 auto',
                  '&:hover': { boxShadow: 8, borderColor: "#2563eb" },
                  transition: "box-shadow 0.2s, border-color 0.2s",
                }}
              >
                <div className="flex justify-between items-center mb-2">
                  <Typography variant="h6" sx={{ color: "#60a5fa", fontWeight: 700 }}>
                    {tournament.name}
                  </Typography>
                  <Box sx={{ width: { xs: '90px', sm: 'auto' }, maxWidth: '100%' }}>
                    <Chip
                      label={tournament.status}
                      color={getStatusColor(tournament.status)}
                      size="small"
                      sx={{
                        width: { xs: '100%', sm: 'auto' },
                        minWidth: 0,
                        maxWidth: '100%',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontSize: { xs: '0.7rem', sm: '0.8rem' },
                      }}
                    />
                  </Box>
                </div>
                <div className="mb-2">
                  <Typography variant="body2"><strong>Date:</strong> {tournament.date} - {tournament.endDate}</Typography>
                  <Typography variant="body2"><strong>Location:</strong> {tournament.location}</Typography>
                  <Typography variant="body2"><strong>Type:</strong> {tournament.type}</Typography>
                  <Typography variant="body2"><strong>Max Participants:</strong> {tournament.participants}</Typography>
                  <Typography variant="body2"><strong>Registered:</strong> {tournament.registeredUsers.length}</Typography>
                  <Typography variant="body2"><strong>Prize Pool:</strong> {tournament.prizePool}</Typography>
                  <Typography variant="body2"><strong>Deadline:</strong> {tournament.registrationDeadline}</Typography>
                  {tournament.registeredUsers.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                      {tournament.registeredUsers.map((user, idx) => (
                        <Chip key={idx} label={user} size="small" variant="outlined" sx={{ color: "#fff", borderColor: "#60a5fa" }} />
                      ))}
                    </Box>
                  )}
                </div>
                {tournament.status === 'Open for Registration' && (
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => registerUser(tournament.id)}
                    disabled={!userName.trim() || tournament.registeredUsers.includes(userName)}
                    sx={{ mt: 'auto', boxShadow: 3, background: "linear-gradient(90deg,#22c55e,#16a34a)", color: "#fff" }}
                  >
                    {tournament.registeredUsers.includes(userName) ? "Registered" : "Register"}
                  </Button>
                )}
              </Box>
            </motion.div>
          ))}
        </motion.div>
      </div>
      {/* Modal */}
      <Modal open={open} onClose={handleClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 60 }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: '#1e293b',
              color: "#e0e7ef",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              width: 400,
              maxWidth: '90%',
              border: "1px solid #334155"
            }}
          >
            <Typography variant="h5" fontWeight={700} mb={2} sx={{ color: "#60a5fa" }}>
              Add Tournament
            </Typography>
            <form onSubmit={handleSubmit} className="space-y-3">
              <TextField fullWidth label="Name" name="name" value={newTournament.name} onChange={handleInputChange} required InputProps={{ style: { color: "#fff" } }} InputLabelProps={{ style: { color: "#b3c2d6" } }} />
              <TextField fullWidth label="Start Date" name="date" type="date" value={newTournament.date} onChange={handleInputChange} InputLabelProps={{ shrink: true, style: { color: "#b3c2d6" } }} required InputProps={{ style: { color: "#fff" } }} />
              <TextField fullWidth label="End Date" name="endDate" type="date" value={newTournament.endDate} onChange={handleInputChange} InputLabelProps={{ shrink: true, style: { color: "#b3c2d6" } }} required InputProps={{ style: { color: "#fff" } }} />
              <TextField fullWidth label="Location" name="location" value={newTournament.location} onChange={handleInputChange} required InputProps={{ style: { color: "#fff" } }} InputLabelProps={{ style: { color: "#b3c2d6" } }} />
              <TextField fullWidth select label="Status" name="status" value={newTournament.status} onChange={handleInputChange} InputProps={{ style: { color: "#fff" } }} InputLabelProps={{ style: { color: "#b3c2d6" } }}>
                <MenuItem value="Upcoming">Upcoming</MenuItem>
                <MenuItem value="Open for Registration">Open for Registration</MenuItem>
              </TextField>
              <TextField fullWidth select label="Type" name="type" value={newTournament.type} onChange={handleInputChange} InputProps={{ style: { color: "#fff" } }} InputLabelProps={{ style: { color: "#b3c2d6" } }}>
                <MenuItem value="Singles">Singles</MenuItem>
                <MenuItem value="Doubles">Doubles</MenuItem>
                <MenuItem value="Mixed">Mixed</MenuItem>
              </TextField>
              <TextField fullWidth label="Max Participants" name="participants" type="number" value={newTournament.participants} onChange={handleInputChange} required InputProps={{ style: { color: "#fff" } }} InputLabelProps={{ style: { color: "#b3c2d6" } }} />
              <TextField fullWidth label="Prize Pool" name="prizePool" value={newTournament.prizePool} onChange={handleInputChange} required InputProps={{ style: { color: "#fff" } }} InputLabelProps={{ style: { color: "#b3c2d6" } }} />
              <TextField fullWidth label="Registration Deadline" name="registrationDeadline" type="date" value={newTournament.registrationDeadline} onChange={handleInputChange} InputLabelProps={{ shrink: true, style: { color: "#b3c2d6" } }} required InputProps={{ style: { color: "#fff" } }} />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
                <Button onClick={handleClose} sx={{ color: "#60a5fa" }}>Cancel</Button>
                <Button type="submit" variant="contained" color="primary">
                  Add
                </Button>
              </Box>
            </form>
          </Box>
        </motion.div>
      </Modal>
    </div>
  );
}

export default Tournaments;
