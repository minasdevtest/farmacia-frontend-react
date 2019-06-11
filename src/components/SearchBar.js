import React, { useState } from 'react'
import { Paper, IconButton, Divider, InputBase } from '@material-ui/core';
import { Search as SearchIcon, Close } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import { getValue, preventDefault } from 'lib/util';

const useStyles = makeStyles({
    root: { margin: '10px 0', display: 'flex', justifyContent: 'flex-end', },
    card: { paddingLeft: 10, display: 'flex', alignItems: 'center' },
    button: { padding: 10, margin: 2 },
    divider: { width: 1, height: 28 },
})

export default function SearchBar({ onSearch, ...props }) {
    const [search, setSearch] = useState('')
    const css = useStyles()
    return (
        <form onSubmit={preventDefault(() => onSearch(search))} className={css.root}>
            <Paper className={css.card}>
                <InputBase placeholder="Pesquisar..." value={search} onChange={getValue(setSearch)} {...props} />
                <IconButton type="submit" className={css.button}>
                    <SearchIcon />
                </IconButton>
                <Divider className={css.divider} />
                <IconButton color="primary" type="button" disabled={!search} onClick={() => setSearch('')} className={css.button}>
                    <Close />
                </IconButton>
            </Paper>
        </form>
    )
}
