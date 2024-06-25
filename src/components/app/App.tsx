import React, { FC, useEffect, useState } from 'react'
import Main from '../main/main'
import './App.css'
import { Redirect, Route, Switch, useHistory } from 'react-router-dom'

const App: FC = () => {
  const [token, setToken] = useState<string>('')
  // const { pathRest } = useParams<{ pathRest: string }>()
  const pathRest = 'admin'
  const history = useHistory()
  if (
    history.location.pathname !== '/admin' &&
    history.location.pathname !== '/admin/autorization'
  ) {
    localStorage.setItem('initialRoute', history.location.pathname)
  }

  useEffect(() => {
    // @ts-expect-error
    setToken(localStorage.getItem('token'))
  }, [token])

  return (
    <div className='App'>
      <Switch>
        <Route path='/' exact={true}>
          <Redirect to={{ pathname: `/${pathRest}/autorization` }} />
        </Route>
        <Route path={`/${pathRest}/autorization`} exact={true}>
          <Main token={token} pathRest={pathRest} setToken={setToken} />
        </Route>
        <Route path={'/admin'} exact>
          <Redirect to={`/${pathRest}/autorization`} />
        </Route>
        <Route path={'*'} exact>
          <Redirect to={`/${pathRest}/autorization`} />
        </Route>
      </Switch>
    </div>
  )
}

export default App
