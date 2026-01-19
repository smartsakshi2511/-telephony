 
import {
  Avatar,
  Chip,
  ClickAwayListener,
  Fade,
  Grid,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
  Paper,
  Popper,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import QueryBuilderTwoToneIcon from '@mui/icons-material/QueryBuilderTwoTone';
import PerfectScrollbar from 'react-perfect-scrollbar';
 

const AnnouncementBox = ({ open = false, anchorEl, onClose, announcements = [] }) => {
  const theme = useTheme();

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement="bottom-end"
      transition
      modifiers={[
        { name: 'offset', options: { offset: [0, 10] } },
        { name: 'preventOverflow', options: { altAxis: true } }
      ]}
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps}>
          <Paper elevation={3}>
            <ClickAwayListener onClickAway={onClose}>
              <List
                sx={{
                  width: '100%',
                  maxWidth: 350,
                  minWidth: 250,
                  backgroundColor: theme.palette.background.paper,
                  pb: 0,
                  borderRadius: '10px'
                }}
              >
                <PerfectScrollbar style={{ height: 320, overflowX: 'hidden' }}>
                  <ListSubheader disableSticky>
                    <Chip size="small" color="primary" label="New Announcements" />
                  </ListSubheader>

                  {announcements.length ? (
                    announcements.map((announcement) => (
                      <ListItemButton key={announcement.id} alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar
                            alt="System"
                            src="/assets/images/iconImages/teleImage.png"
                          />
                        </ListItemAvatar>

                        <ListItemText
                          primary={<Typography variant="subtitle1">System</Typography>}
                          secondary={
                            <Typography variant="subtitle2">{announcement.message}</Typography>
                          }
                        />

                        <ListItemSecondaryAction sx={{ top: 24 }}>
                          <Grid container justifyContent="flex-end" alignItems="center">
                            <Grid item>
                              <QueryBuilderTwoToneIcon
                                sx={{ fontSize: '0.75rem', mr: 0.5, color: theme.palette.grey[400] }}
                              />
                            </Grid>
                            <Grid item>
                              <Typography
                                variant="caption"
                                sx={{ color: theme.palette.grey[400] }}
                              >
                                {new Date(announcement.created_at).toLocaleTimeString()}
                              </Typography>
                            </Grid>
                          </Grid>
                        </ListItemSecondaryAction>
                      </ListItemButton>
                    ))
                  ) : (
                    <Typography variant="body2" sx={{ px: 2, py: 1 }}>
                      No announcements today.
                    </Typography>
                  )}
                </PerfectScrollbar>
              </List>
            </ClickAwayListener>
          </Paper>
        </Fade>
      )}
    </Popper>
  );
};



export default AnnouncementBox;
