import React, { useState } from 'react'
import FormFields from './FormFields';
import { useSdk } from 'lib/sdkContext';
import { preventDefault } from 'lib/util';
import { Snackbar } from '@material-ui/core';

const fields = [
    ['name', 'Nome', { required: true }],
    ['email', 'Email', { required: true, type: 'email' }],
    ['phone', 'Telefone', { type: 'tel', placeholder: '(XX) XXXX-XXXX' }],
    ['message', 'Mensagem', { multiline: true, placeholder: 'Insira sua dúvida ou opinião...' }],
]

export default function ContactForm({ children, ...props }) {
    const [contact, setContact] = useState({})
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const sdk = useSdk()

    const submitContact = async () => {
        setLoading(true)
        await sdk.sac.add(contact)
        setContact({})
        setSent(true)
        setLoading(false)
    }

    return (
        <form method="post" onSubmit={preventDefault(submitContact)}>
            {children(
                <FormFields
                    fields={fields}
                    disabled={loading}
                    values={contact}
                    onChange={(field, value) => setContact({ ...contact, [field]: value })}
                    {...props}
                />
                , loading)}
            <Snackbar
                message="Mensagem enviada!"
                autoHideDuration={6000}
                open={sent}
                onClose={() => setSent(false)} />
        </form>
    )
}
