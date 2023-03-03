import { Button, Grommet, Nav, Sidebar, Text } from 'grommet';

import { Link, Outlet } from 'react-router-dom';


const theme = {
  global: {
    font: {
      family: "Inter, Avenir, Helvetica, Arial, sans-serif;",
      size: "24px",
      height: "20px",
    },

  },
};



function App() {

  return (
    <Grommet theme={theme}  >

      <Sidebar
        background="brand"
        round="small"
        header={
          <Text>Nav</Text>
        }
        responsive={false}
        pad={{ left: 'medium', right: 'large', vertical: 'medium' }}
      >
        <Nav gap="small">
          <Link to={`/user`}>User</Link>
          <Link to={`/all_type_table`}>AllTypeTable</Link>
        </Nav>

      </Sidebar>
      <Outlet></Outlet>

    </Grommet>
  )
}

export default App
