import * as React from 'react';
import { useState, useEffect } from 'react';
import { createStyles, Theme, withStyles, WithStyles, useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
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
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
    const { children, classes, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
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

const ConfirmDialog = ({ props, content, onChildClick }) => {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const handleClose = (isCanceled) => {
        setOpen(false);
        onChildClick(isCanceled);
    };
    useEffect(() => {
        setOpen(props);
    }, [props]);

    return (
        <div>
            <Dialog onClose={() => handleClose(false)} aria-labelledby="customized-dialog-title" open={open} >
                <DialogTitle id="customized-dialog-title" >
                    Load older events?
                </DialogTitle>
                <DialogContent dividers>
                    <Typography gutterBottom >
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path d="M.5 16h17L9 1 .5 16zm9.5-2H8v-2h2v2zm0-3H8V7h2v4z" /></svg>
                            <span>Choosing to load older events can take awhile. Are you sure you want to do this?</span>
                        </div>
                    </Typography>

                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleClose(true)} color="primary" className="descLink">
                        Yes
                    </Button>
                    <Button onClick={() => handleClose(false)} color="default" >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};
export default ConfirmDialog;