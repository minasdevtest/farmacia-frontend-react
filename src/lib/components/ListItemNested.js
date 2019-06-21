import React, { useState } from 'react';
import { List, ListItem, Collapse } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';


export default function ListItemNested({ initialOpen = true, titleChildren, children }) {
    const [open, setOpen] = useState(initialOpen)
    return (<>
        <ListItem button onClick={() => setOpen(!open)}>
            {titleChildren}
            <ExpandMore style={{ transition: 'transform 200ms ease-out', transform: `rotate(${open ? 180 : 0}deg)` }} />
        </ListItem>

        <Collapse in={open} timeout="auto" unmountOnExit>
            <List disablePadding dense>
                {children}
            </List>
        </Collapse>
    </>)
}
