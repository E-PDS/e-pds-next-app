import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { Warning } from '@mui/icons-material';
import '../styles/dialogs.scss';

export default function ConfirmBox({ title, description, onConfirm, open, setOpen }) {

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        className: 'glass-dialog-paper'
      }}
      BackdropProps={{
        className: 'glass-dialog-backdrop'
      }}
    >
      <DialogTitle className="dialog-title">
        <Avatar className="dialog-icon-avatar error">
          <Warning />
        </Avatar>
        <Typography sx={{ fontWeight: 600, color: '#2F3E46' }}>
          {title}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pb: 2 }}>
        <Typography variant="body1" className="dialog-content-text">
          {description}
        </Typography>
      </DialogContent>

      <DialogActions className="dialog-actions">
        <Button
          onClick={handleClose}
          variant="outlined"
          className="dialog-button-outlined"
        >
          No
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          className="dialog-button-contained error"
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
