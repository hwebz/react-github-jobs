import React from 'react'
import { Pagination } from 'react-bootstrap'

export default function JobsPagination({ page, setPage, hasNextPage }) {
    return (
        <Pagination>
            {page !== 1 && (
                <>
                    <Pagination.Prev onClick={() => setPage(-1)} />
                    <Pagination.Item onClick={() => setPage(1)}>1</Pagination.Item>
                </>
            )}
            {page > 2 && (
                <>
                    <Pagination.Ellipsis />
                    <Pagination.Item onClick={() => setPage(-1)}>{ page - 1 }</Pagination.Item>
                </>
            )}
            <Pagination.Item active>{ page }</Pagination.Item>
            {hasNextPage && (
                <>
                    <Pagination.Item onClick={() => setPage(1)}>{ page + 1 }</Pagination.Item>
                    <Pagination.Next onClick={() => setPage(1)} />
                </>
            )}
        </Pagination>
    )
}
