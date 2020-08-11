import { useReducer, useEffect } from 'react';
import axios from 'axios';

const ACTIONS = {
    MAKE_REQUEST: 'make-request',
    GET_DATA: 'get-data',
    ERROR: 'error',
    UPDATE_HAS_NEXT_PAGE: 'update-has-next-page'
}

const BASE_URL = "/positions.json"

function reducer(state, action) {
    switch(action.type) {
        case ACTIONS.MAKE_REQUEST:
            return {
                loading: true,
                jobs: []
            }
        case ACTIONS.GET_DATA:
            return {
                ...state,
                loading: false,
                jobs: action.payload.jobs
            }
        case ACTIONS.ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload.error,
                jobs: []
            }
        case ACTIONS.UPDATE_HAS_NEXT_PAGE:
            return {
                ...state,
                hasNextPage: action.payload.hasNextPage
            }
        default:
            return state
    }
}

export default function useFetchJobs(params, page) {
    const [state, dispatch] = useReducer(reducer, { jobs: [], loading: true });

    useEffect(() => {
        const cancelToken = axios.CancelToken.source();
        dispatch({
            type: ACTIONS.MAKE_REQUEST
        })
        // Get jobs
        axios.get(BASE_URL, {
            cancelToken: cancelToken.token,
            params: {
                markdown: true,
                page: page,
                ...params
            }
        }).then(res => {
            dispatch({
                type: ACTIONS.GET_DATA,
                payload: {
                    jobs: res.data
                }
            })
        }).catch(e => {
            if (axios.isCancel(e)) return
            dispatch({
                type: ACTIONS.ERROR,
                payload: {
                    error: e
                }
            })
        })

        // Check for hasNextPage
        const cancelToken2 = axios.CancelToken.source();
        axios.get(BASE_URL, {
            cancelToken: cancelToken2.token,
            params: {
                markdown: true,
                page: page + 1,
                ...params
            }
        }).then(res => {
            dispatch({
                type: ACTIONS.UPDATE_HAS_NEXT_PAGE,
                payload: {
                    hasNextPage: true
                }
            })
        }).catch(e => {
            if (axios.isCancel(e)) return
            dispatch({
                type: ACTIONS.UPDATE_HAS_NEXT_PAGE,
                payload: {
                    hasNextPage: false
                }
            })
        })

        return () => {
            cancelToken.cancel()
            cancelToken2.cancel()
        }
    }, [params, page])

    return state
}