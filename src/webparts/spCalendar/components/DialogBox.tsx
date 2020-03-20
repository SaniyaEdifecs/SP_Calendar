import * as React from 'react';
import { useState, useEffect } from 'react';
import { createStyles, Theme, withStyles, WithStyles, useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import * as moment from 'moment-timezone';
import '../components/CommonStyleSheet.scss';

const styles = (theme: Theme) =>
    createStyles({
        root: {
            margin: 0,
            padding: theme.spacing(2),
        },
        closeButton: {
            position: 'absolute',
            right: theme.spacing(1),
            top: theme.spacing(1),
            color: theme.palette.grey[500],
        },
    });

export interface DialogTitleProps extends WithStyles<typeof styles> {
    id: string;
    children: React.ReactNode;
    onClose: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme: Theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

const DialogBox = ({ props, content, onChildClick  }) => {
    const theme = useTheme();
    const zone = moment.tz("America/Los_Angeles").zoneAbbr();
    const [open, setOpen] = useState(false);
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const handleClose = () => {
        setOpen(false);
        onChildClick(false);
    };
    useEffect(() => {
        setOpen(props);
    }, [props]);

    return (
        <div>
            <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} >
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                   Change Event
                </DialogTitle>
                <DialogContent dividers>
                    <Typography gutterBottom>
                    <div>{ReactHtmlParser(content.mrTITLE && content.mrTITLE)}</div>
                    <div><a target='_blank' className="descLink" href={"https://esd/MRcgi/MRlogin.pl?DL="+content.mrID+"DA8"}>View Ticket</a></div>
                    </Typography>
                    <Typography gutterBottom>
                        <b>Start:</b> {moment(content.Scheduled__bStart).format('MMM Do h:mm A')+" "+zone} <br />
                        <b>End:</b> {moment(content.Scheduled__bEnd).format('MMM Do h:mm A')+" "+zone}
                        {ReactHtmlParser(content.mrDESCRIPTION)}

                    </Typography>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" className="descLink">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};
export default DialogBox;