import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import coffee from '../../coffee.svg'
import './logo.css'

function Logo({ size, text, clickable, className }) {
  const Logo = () => (
    <img className={`logo logo-${size} unselectable`} src={coffee} alt="coffee" />
  )
  const LogoText = () =>
    text ? (
      <h1 className={`logo-text logo-text-${size} unselectable`}>{text}</h1>
    ) : (
      <Fragment />
    )

  return (
    <div className={`${className} logo-container logo-container-${size}`}>
      {clickable ? (
        <Link to="/" className="logo-link">
          <Logo />
          <LogoText />
        </Link>
      ) : (
        <Fragment>
          <Logo />
          <LogoText />
        </Fragment>
      )}
    </div>
  )
}

export default Logo
