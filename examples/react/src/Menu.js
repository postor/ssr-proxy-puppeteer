import React from 'react';
import { Link } from 'react-router-dom'

const style = { margin: '0 15px' }

function Menu() {
  return (
    <nav>
      <Link to="/foo" style={style}>foo</Link>
      <Link to="/bar" style={style}>bar</Link>
    </nav>
  );
}

export default Menu;
