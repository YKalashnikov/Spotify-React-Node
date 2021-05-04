import { useState, useEffect } from 'react';
import axios from 'axios';

/* type Props = {
    code: string | undefined
} */

interface RespProps {
    accessToken: string
    expiresIn: number
    refreshToken: string
}

const useAuth = (code: string): string | undefined => {
    const [accessToken, setAccessToken] = useState<string>()
    const [refreshToken, setRefreshToken] = useState<string>()
    const [expiresIn, setExpiresIn] = useState<number>()
    useEffect(() => {
        axios
            .post<RespProps>('http://localhost:3001/login', {
                code
            })
            .then(res => {
                setAccessToken(res.data.accessToken)
                setRefreshToken(res.data.refreshToken)
                setExpiresIn(res.data.expiresIn)

                window.history.pushState({}, '', '/')

            })
            .catch((err) => {
                window.location.href = "/"
            })
    }, [code])

    useEffect(() => {
        if (!refreshToken || !expiresIn) return
        const timeout = setInterval(() => {
            axios
                .post<RespProps>('http://localhost:3001/refresh', {
                    refreshToken
                })
                .then(res => {
                    setAccessToken(res.data.accessToken)
                    setExpiresIn(res.data.expiresIn)
                })
                .catch((err) => {
                    window.location.href = "/"
                })
        }, (expiresIn - 60) * 1000)
        return () => clearInterval(timeout)
    }, [expiresIn, refreshToken])
        return accessToken
}

export default useAuth;
