import React, { FC, ReactElement } from 'react'
import { Redirect, Route } from 'react-router-dom'
import { TRest } from '../../utils/typesFromBackend'

interface IProtectedRoute {
  path: string
  exact: boolean
  children: ReactElement
  isLoggedIn: boolean
  rest: TRest
}
const ProtectedRoute: FC<IProtectedRoute> = ({ isLoggedIn, children, rest }) => {
  return (
    <Route {...rest}
      render={({ location }) =>
        isLoggedIn
          ? (
              children
            )
          : (
            <Redirect to={{ pathname: `/${rest.pathRest}/autorization`, state: { from: location } }} />
            )
      }
    />
  )
}
export default ProtectedRoute
