import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { CheckCircleOutline, Cancel } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import '../styles/dialogs.scss';

export default function AlertBox({ title, description, onConfirm, redirect, open, setOpen, type = 'success' }) {
  const router = useRouter();
  const handleClose = () => {
    setOpen(false);
    if (redirect) router.push(redirect);
  };

  const getIconAndColor = () => {
    switch (type) {
      case 'success':
        return { icon: <CheckCircleOutline />, colorClass: 'success' };
      case 'error':
        return { icon: <Cancel />, colorClass: 'error' };
      default:
        return { icon: <CheckCircleOutline />, colorClass: 'success' };
    }
  };

  const { icon, colorClass } = getIconAndColor();

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
        <Avatar className={`dialog-icon-avatar ${colorClass}`}>
          {icon}
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
          onClick={() => { if (onConfirm) onConfirm(); handleClose(); }}
          variant="contained"
          className={`dialog-button-contained ${colorClass}`}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
